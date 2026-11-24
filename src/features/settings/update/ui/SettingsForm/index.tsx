import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Label } from '@/shared/ui/Label';
import { Button } from '@/shared/ui/Button';
import { Loader } from '@/shared/ui/Loader';
import { Input, InputRange } from '@/shared/ui/Input';
import { getErrorMessage } from '@/shared/api/client';
import { millisecondsToTime, timeToMilliseconds } from '@/shared/lib/date';

import { useLatestEvents } from '@/entities/telemetry';
import { getSettingsPatch, queries, updateSettings, type Settings } from '@/entities/settings';

import { LightCyclePicker } from '../LightCyclePicker';
import { Skeleton } from '../Skeleton';

const ApplyStatus = ({ isAwaiting, isTimedOut, isApplied }: { isAwaiting: boolean, isTimedOut: boolean, isApplied: boolean }) => {
    if (isAwaiting) {
        return <p className="text-xs text-slate-400 text-center">Saved, waiting for the controller…</p>;
    }

    if (isApplied) {
        return <p className="text-xs text-emerald-600 text-center">Applied by the controller</p>;
    }

    if (isTimedOut) {
        return <p className="text-xs text-slate-400 text-center">Saved. The controller picks it up once it is online.</p>;
    }

    return null;
};

export const SettingsForm = ({ controllerId }: { controllerId: string }) => {
    const queryClient = useQueryClient();
    const { data } = useQuery(queries.get(controllerId));

    const [draft, setDraft] = useState<Settings>();

    const latest = useLatestEvents(controllerId, {
        until: (newEvent) => Boolean(newEvent('settings:applied')),
    });

    const { mutate: update, isPending: isSaving, error } = useMutation({
        mutationFn: updateSettings,
        onMutate: latest.startAwaiting,
        onSuccess: (settings) => {
            queryClient.setQueryData(queries.get(controllerId).queryKey, settings);
            setDraft(undefined);
        },
        onError: latest.reset,
    });

    if (!data) {
        return <Skeleton />;
    }

    const state = draft ?? data;
    const patch = getSettingsPatch(data, state);
    const isChanged = Object.keys(patch).length > 0;

    const durationTime = millisecondsToTime(state.light.durationMs);
    const fanSpeedPercentage = Math.trunc((state.fan.defaultSpeed / 255) * 100);

    const setLight = (light: Partial<Settings['light']>) => setDraft({ ...state, light: { ...state.light, ...light } });

    const onSubmit = () => update({ controllerId, patch });

    return (
        <div className="flex flex-col gap-4">
            <div className="w-full h-full mx-auto">
                <LightCyclePicker
                    onTime={state.light.onTime}
                    duration={state.light.durationMs}
                    onChange={(onTime, durationMs) => setLight({ onTime, durationMs })}
                />
            </div>

            <div className="flex gap-4 justify-between">
                <Label className="w-1/2">
                    On Time:
                    <Input type="time" value={state.light.onTime} onChange={onTime => setLight({ onTime })} />
                </Label>

                <Label className="w-1/2">
                    Duration:
                    <Input type="text" value={durationTime} onChange={value => setLight({ durationMs: timeToMilliseconds(value) })} />
                </Label>
            </div>

            <div className="flex flex-col gap-4 justify-between">
                <Label>
                    <div className="flex justify-between">
                        Temperature Threshold:
                        <span>
                            {state.sensor.thresholdTemperature}℃
                        </span>
                    </div>

                    <InputRange
                        value={state.sensor.thresholdTemperature}
                        onChange={value => setDraft({ ...state, sensor: { thresholdTemperature: Math.round(value) } })}
                    />
                </Label>

                <Label>
                    <div className="flex justify-between">
                        Fan Speed:
                        <span>
                            {fanSpeedPercentage}%
                        </span>
                    </div>
                    <InputRange
                        value={fanSpeedPercentage}
                        onChange={value => setDraft({ ...state, fan: { defaultSpeed: Math.round(value * 2.55) } })}
                    />
                </Label>
            </div>

            {error && <p className="text-xs text-red-600">{getErrorMessage(error)}</p>}

            <div className="flex flex-col gap-2 mt-1">
                <Button width="full" onClick={onSubmit} disabled={!isChanged || isSaving}>
                    {isSaving ? <Loader status="Saving" /> : 'Save'}
                </Button>

                {!isChanged && (
                    <ApplyStatus
                        isAwaiting={latest.isAwaiting}
                        isTimedOut={latest.isTimedOut}
                        isApplied={Boolean(latest.newEvent('settings:applied'))}
                    />
                )}
            </div>
        </div>
    );
};
