import { Bulb, Drop, Fan, Temperature } from '@/components/Icon';
import { ControllerState } from '@/types';


export const StatePanel = ({ state, hasTemperatureWarning }: { state: ControllerState, hasTemperatureWarning?: boolean }) => {
    const isOn = 'isOn' in state ? (state.isOn ? 'On' : 'Off') : '-';
    const humidity = 'humidity' in state ? state.humidity : '-';
    const temperature = 'temperature' in state ? state.temperature : '-';
    const fanSpeed = 'fanSpeed' in state ? (state.fanSpeed / 255 * 100 | 0) : '-';

    return (
        <div className="flex justify-between items-center p-4">
            <div className={`flex flex-col items-center ${state.isOn ? 'text-yellow-600' : ''}`}>
                <Bulb /> {isOn}
            </div>

            <div className="flex flex-col items-center">
                <Drop /> {humidity} %
            </div>

            <div className={`flex flex-col items-center ${hasTemperatureWarning ? 'text-red-600' : ''}`}>
                <Temperature /> {temperature} ℃
            </div>

            <div className="flex flex-col items-center">
                <Fan /> {fanSpeed} %
            </div>
        </div>
    );
};
