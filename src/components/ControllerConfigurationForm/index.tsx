import { ClockRange } from 'clock-range';
import { Input, InputRange } from '../Input';
import { getTimeByOnTimeAndDuration, hoursToMilliseconds, millisecondsToTime, timeToMilliseconds } from '../../helpers';
import { ControllerConfiguration } from '../../types.d';


const labelClassList = 'flex flex-col gap-2 mb-4';


export const ControllerConfigurationForm = <T extends ControllerConfiguration>({ state, onChange }: { state: T, onChange: (state: T) => void }) => {
    const time = getTimeByOnTimeAndDuration(state.onTime, state.duration);
    const durationTime = millisecondsToTime(state.duration);
    const fanSpeedPercentage = ((state.fanSpeed / 255) * 100).toFixed();

    const setOnTime = ([start, end]: [number, number]) => {
        const duration = hoursToMilliseconds(Math.abs(start > end ? 24 - start + end : end - start));
        const onTime = [start, start % 1 * 60].map(time => time.toFixed().padStart(2, '0')).join(':');

        onChange({ ...state, onTime, duration });
    };

    return (
        <div>
            <div className="w-72 h-72 p-4 mx-auto">
                {/* @ts-ignore: should be fixed in clock-range package */}
                <ClockRange range={time} onChange={setOnTime} />
            </div>

            <div className="flex gap-4 justify-between">

                <label className={`${labelClassList} w-1/2`}>
                    On time:

                    <Input
                        type="time"
                        value={state.onTime}
                        onChange={onTime => onChange({ ...state, onTime })}
                    />
                </label>

                <label className={`${labelClassList} w-1/2`}>
                    Duration:

                    <Input
                        type="time"
                        value={durationTime}
                        onChange={value => onChange({ ...state, duration: timeToMilliseconds(value) })}
                    />
                </label>

            </div>

            <label className={labelClassList}>
                Threshold temperature, ℃:

                <Input
                    type="number"
                    value={state.thresholdTemperature}
                    onChange={value => onChange({ ...state, thresholdTemperature: Number(value) })}
                />
            </label>

            <label className={labelClassList}>
                Fan speed: {fanSpeedPercentage}%

                <InputRange value={state.fanSpeed} onChange={fanSpeed => onChange({ ...state, fanSpeed })} />
            </label>
        </div>
    );
};
