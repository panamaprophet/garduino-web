import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { Label } from '@/shared/ui/Label';
import { Button } from '@/shared/ui/Button';
import { Loader } from '@/shared/ui/Loader';
import { Input, InputRange } from '@/shared/ui/Input';

import { millisecondsToTime, timeToMilliseconds } from '@/shared/lib/date';

import { queries, updateConfiguration } from '@/entities/configuration';
import { CircularSlider } from '../CircularSlider';

export const EditForm = ({ controllerId }: { controllerId: string }) => {
    const { data, refetch } = useQuery(queries.getConfiguration(controllerId));
    const { mutateAsync: update } = useMutation({ mutationFn: updateConfiguration });

    const [draft, setDraft] = useState<typeof data>();

    if (!data) {
        return (
            <div className="flex justify-between items-center p-7">
                <Loader status="Loading configuration" />
            </div>
        );
    }

    const state = draft || data;

    const durationTime = millisecondsToTime(state.duration);
    const fanSpeedPercentage = Math.trunc((state.fanSpeed / 255) * 100);

    const _onSubmit = async () => {
        if (!draft) {
            throw Error('no draft found');
        }

        await update(draft);

        refetch();
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="w-4xl h-4xl mx-auto">
                <CircularSlider
                    onTime={state.onTime}
                    duration={state.duration}
                    onChange={(onTime, duration) => setDraft({ ...state, onTime, duration })}
                />
            </div>

            <div className="flex gap-4 justify-between">
                <Label className="w-1/2">
                    On Time:
                    <Input type="time" value={state.onTime} onChange={onTime => setDraft({ ...state, onTime })} />
                </Label>

                <Label className="w-1/2">
                    Duration:
                    <Input type="time" value={durationTime} onChange={value => setDraft({ ...state, duration: timeToMilliseconds(value) })} />
                </Label>
            </div>

            <div className="flex flex-col gap-4 justify-between">
                <Label>
                    <div className="flex justify-between">
                        Temperature Threshold:
                        <span>
                            {state.thresholdTemperature}℃
                        </span>
                    </div>

                    <InputRange value={state.thresholdTemperature} onChange={value => setDraft({ ...state, thresholdTemperature: Math.round(value) })} />
                </Label>

                <Label>
                    <div className="flex justify-between">
                        Fan Speed:
                        <span>
                            {fanSpeedPercentage}%
                        </span>
                    </div>
                    <InputRange value={fanSpeedPercentage} onChange={fanSpeed => setDraft({ ...state, fanSpeed: Math.round(fanSpeed * 2.55) })} />
                </Label>
            </div>

            <div className="flex justify-between mt-1">
                <Button width="full" onClick={_onSubmit}>
                    Save
                </Button>
            </div>
        </div>
    );
};
