import { useState } from 'react';
import { ClockRange } from 'clock-range';
import { useMutation, useQuery } from '@tanstack/react-query';

import { Label } from '@/shared/ui/Label';
import { Button } from '@/shared/ui/Button';
import { Loader } from '@/shared/ui/Loader';
import { Input, InputRange } from '@/shared/ui/Input';

import {
    addDays,
    getTimeRangeInHours,
    hoursToTime,
    millisecondsToTime,
    Time,
    timeToMilliseconds,
} from '@/shared/lib/date';

import { queries, updateConfiguration } from '@/entities/configuration';

export const ConfigurationForm = ({ controllerId }: { controllerId: string }) => {
    const { data: state, refetch } = useQuery(queries.getConfiguration(controllerId));
    const { mutateAsync: update } = useMutation({ mutationFn: updateConfiguration });

    const [draft, setDraft] = useState<typeof state>();

    if (!state) {
        return <Loader status="Loading" />;
    }

    const durationTime = millisecondsToTime(state.duration);
    const fanSpeedPercentage = Math.trunc((state.fanSpeed / 255) * 100);
    const [startTime, endTime] = getTimeRangeInHours(state.onTime, state.duration);

    const setOnTime = ([start, end]: [number, number]) => {
        const on = new Date(`01/01/2024 ${hoursToTime(start)}`);
        const off = new Date(`01/01/2024 ${hoursToTime(end)}`);

        const duration = off > on
            ? off.valueOf() - on.valueOf()
            : addDays(off, 1).valueOf() - on.valueOf();

        const onTime = `${on.getHours()}:${on.getMinutes()}` as Time;

        setDraft({ ...state, onTime, duration });
    };

    const _onSubmit = async () => {
        if (!draft) {
            throw Error('no draft found');
        }

        await update(draft);

        refetch();
    };

    return (
        <div>
            <div className="w-72 h-72 p-4 mx-auto">
                <ClockRange range={[startTime, endTime]} onChange={setOnTime} />
            </div>

            <div className="flex gap-4 justify-between">
                <Label className="w-1/2">
                    On time:
                    <Input type="time" value={hoursToTime(startTime)} onChange={onTime => setDraft({ ...state, onTime })} />
                </Label>

                <Label className="w-1/2">
                    Duration:
                    <Input type="time" value={durationTime} onChange={value => setDraft({ ...state, duration: timeToMilliseconds(value) })} />
                </Label>
            </div>

            <div className="flex gap-4 justify-between">
                <Label className="w-1/2">
                    Threshold T: {state.thresholdTemperature}℃:
                    <InputRange value={state.thresholdTemperature} onChange={value => setDraft({ ...state, thresholdTemperature: Math.round(value) })} />
                </Label>

                <Label className="w-1/2">
                    Fan speed: {fanSpeedPercentage}%
                    <InputRange value={fanSpeedPercentage} onChange={fanSpeed => setDraft({ ...state, fanSpeed: Math.round(fanSpeed * 2.55) })} />
                </Label>
            </div>

            <div className="flex gap-4 justify-between mb-7">
                <Button width="full" onClick={_onSubmit}>
                    Save
                </Button>
            </div>
        </div>
    );
};
