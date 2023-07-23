import { ClockRange } from 'clock-range';
import { Input, InputRange } from '../Input';
import { Label } from '../Label';
import { getTimeRangeInHours, hoursToMilliseconds, millisecondsToTime, timeToMilliseconds } from '../../helpers';
import { ControllerConfiguration, Time } from '../../types.d';


export const ControllerConfigurationForm = ({ state, onChange }: { state: ControllerConfiguration, onChange: (state: ControllerConfiguration) => void }) => {
    const time = getTimeRangeInHours(state.onTime, state.duration);
    const durationTime = millisecondsToTime(state.duration);
    const fanSpeedPercentage = (state.fanSpeed / 255) * 100 | 0;

    const setOnTime = ([start, end]: [number, number]) => {
        const duration = hoursToMilliseconds(Math.abs(start > end ? 24 - start + end : end - start));
        const onTime = [start | 0, (start % 1 * 60) | 0].map(time => time.toFixed().padStart(2, '0')).join(':') as Time;

        onChange({ ...state, onTime, duration });
    };

    return (
        <div>
            <div className="w-72 h-72 p-4 mx-auto">
                <ClockRange range={time} onChange={setOnTime} />
            </div>

            <div className="flex gap-4 justify-between">
                <Label className="w-1/2">
                    On time:
                    <Input type="time" value={state.onTime} onChange={onTime => onChange({ ...state, onTime })} />
                </Label>

                <Label className="w-1/2">
                    Duration:
                    <Input type="time" value={durationTime} onChange={value => onChange({ ...state, duration: timeToMilliseconds(value) })} />
                </Label>
            </div>

            <Label>
                Threshold temperature, ℃:
                <Input type="number" value={state.thresholdTemperature} onChange={value => onChange({ ...state, thresholdTemperature: Number(value) })} />
            </Label>

            <Label>
                Fan speed: {fanSpeedPercentage}%
                <InputRange value={fanSpeedPercentage} onChange={fanSpeed => onChange({ ...state, fanSpeed: fanSpeed * 2.55 })} />
            </Label>
        </div>
    );
};
