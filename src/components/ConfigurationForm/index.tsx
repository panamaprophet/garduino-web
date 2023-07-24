import { ClockRange } from 'clock-range';
import { Input, InputRange } from '../Input';
import { Label } from '../Label';
import {
    addHoursToTime,
    getTimeRangeInHours,
    getTimeZoneOffset,
    hoursToMilliseconds,
    hoursToTime,
    millisecondsToTime,
    timeToMilliseconds,
} from '../../helpers';
import { ControllerConfiguration, Time } from '../../types.d';


export const ConfigurationForm = ({ state, onChange }: { state: ControllerConfiguration, onChange: (state: ControllerConfiguration) => void }) => {
    const durationTime = millisecondsToTime(state.duration);
    const fanSpeedPercentage = (state.fanSpeed / 255) * 100 | 0;

    const timezoneOffset = getTimeZoneOffset();
    const timeRange = getTimeRangeInHours(state.onTime, state.duration);

    const startTime = timeRange[0] - timezoneOffset;
    const endTime = timeRange[1] - timezoneOffset;

    const setOnTime = ([start, end]: [number, number]) => {
        const duration = hoursToMilliseconds(Math.abs(start >= end ? 24 - start + end : end - start));
        const onTime = [(start + timezoneOffset) | 0, 60 * (start % 1) | 0].map(time => time.toString().padStart(2, '0')).join(':') as Time;

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
                    <Input type="time" value={hoursToTime(startTime)} onChange={onTime => onChange({ ...state, onTime: addHoursToTime(onTime, timezoneOffset) })} />
                </Label>

                <Label className="w-1/2">
                    Duration:
                    <Input type="time" value={durationTime} onChange={value => onChange({ ...state, duration: timeToMilliseconds(value) })} />
                </Label>
            </div>

            <div className="flex gap-4 justify-between">
                <Label className="w-1/2">
                    Threshold T: {state.thresholdTemperature}℃:
                    <InputRange value={state.thresholdTemperature} onChange={value => onChange({ ...state, thresholdTemperature: value })} />
                </Label>

                <Label className="w-1/2">
                    Fan speed: {fanSpeedPercentage}%
                    <InputRange value={fanSpeedPercentage} onChange={fanSpeed => onChange({ ...state, fanSpeed: fanSpeed * 2.55 })} />
                </Label>
            </div>
        </div>
    );
};
