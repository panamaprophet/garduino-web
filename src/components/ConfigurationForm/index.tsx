import { ClockRange } from 'clock-range';
import { Input, InputRange } from '@/components/Input';
import { Label } from '@/components/Label';
import {
    addDays,
    getTimeRangeInHours,
    hoursToTime,
    millisecondsToTime,
    timeToMilliseconds,
} from '@/helpers';
import { ControllerConfiguration, Time } from '@/types';


export const ConfigurationForm = ({ state, onChange }: { state: ControllerConfiguration, onChange: (state: ControllerConfiguration) => void }) => {
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

        onChange({ ...state, onTime, duration });
    };

    return (
        <div>
            <div className="w-72 h-72 p-4 mx-auto">
                <ClockRange range={[startTime, endTime]} onChange={setOnTime} />
            </div>

            <div className="flex gap-4 justify-between">
                <Label className="w-1/2">
                    On time:
                    <Input type="time" value={hoursToTime(startTime)} onChange={onTime => onChange({ ...state, onTime })} />
                </Label>

                <Label className="w-1/2">
                    Duration:
                    <Input type="time" value={durationTime} onChange={value => onChange({ ...state, duration: timeToMilliseconds(value) })} />
                </Label>
            </div>

            <div className="flex gap-4 justify-between">
                <Label className="w-1/2">
                    Threshold T: {state.thresholdTemperature}℃:
                    <InputRange value={state.thresholdTemperature} onChange={value => onChange({ ...state, thresholdTemperature: Math.round(value) })} />
                </Label>

                <Label className="w-1/2">
                    Fan speed: {fanSpeedPercentage}%
                    <InputRange value={fanSpeedPercentage} onChange={fanSpeed => onChange({ ...state, fanSpeed: Math.round(fanSpeed * 2.55) })} />
                </Label>
            </div>
        </div>
    );
};
