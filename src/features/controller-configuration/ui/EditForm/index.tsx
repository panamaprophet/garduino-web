import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { Label } from '@/shared/ui/Label';
import { Button } from '@/shared/ui/Button';
import { Loader } from '@/shared/ui/Loader';
import { Input, InputRange } from '@/shared/ui/Input';

import { millisecondsToTime, timeToMilliseconds } from '@/shared/lib/date';

import { queries, updateConfiguration } from '@/entities/configuration';
import { CircularSlider } from '../CircularSlider';

const timeToAngle = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);

    if (typeof hours !== 'number' || typeof minutes !== 'number') {
        return 0;
    }

    return ((hours + minutes / 60) / 24) * 360
}

const angleToTime = (angle: number) => {
    const totalHours = (angle / 360) * 24
    const hours = Math.floor(totalHours)
    const minutes = Math.floor((totalHours - hours) * 60)
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
}

export const EditForm = ({ controllerId }: { controllerId: string }) => {
    const { data, refetch } = useQuery(queries.getConfiguration(controllerId));
    const { mutateAsync: update } = useMutation({ mutationFn: updateConfiguration });

    const [draft, setDraft] = useState<typeof data>();

    if (!data) {
        return <Loader status="Loading" />;
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

    const handleCycleChange = (start: number, end: number) => {
        const onTime = angleToTime(start);
        const offTime = angleToTime(end);

        let duration = timeToMilliseconds(offTime) - timeToMilliseconds(onTime);

        if (duration < 0) {
            const dayInMilliseconds = 24 * 60 * 60 * 1000;

            duration += dayInMilliseconds;
        }

        setDraft({ ...state, onTime, duration })
    };

    return (
        <div>
            <div className="w-4xl h-4xl mx-auto">
                <CircularSlider
                    startAngle={timeToAngle(state.onTime)}
                    endAngle={timeToAngle(millisecondsToTime(timeToMilliseconds(state.onTime) + state.duration)) % 360}
                    onChange={handleCycleChange}
                />
            </div>

            <div className="flex gap-4 justify-between">
                <Label className="w-1/2">
                    On time:
                    <Input type="time" value={state.onTime} onChange={onTime => setDraft({ ...state, onTime })} />
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

            <div className="flex gap-4 justify-between">
                <Button width="full" onClick={_onSubmit}>
                    Save
                </Button>
            </div>
        </div>
    );
};
