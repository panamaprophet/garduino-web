import { Bulb, Drop, Fan, Temperature } from '../Icon';
import { ControllerState } from '../../types';


export const StatePanel = ({ state }: { state: ControllerState }) => {
    const isOn = 'isOn' in state ? (state.isOn ? 'On' : 'Off') : '-';
    const humidity = 'humidity' in state ? state.humidity : '-';
    const temperature = 'temperature' in state ? state.temperature : '-';
    const fanSpeed = 'fanSpeed' in state ? (state.fanSpeed / 255 * 100 | 0) : '-';

    return (
        <div className="flex justify-between items-center p-4">
            <div className="flex flex-col items-center">
                <Bulb /> {isOn}
            </div>

            <div className="flex flex-col items-center">
                <Drop /> {humidity} %
            </div>

            <div className="flex flex-col items-center">
                <Temperature /> {temperature} ℃
            </div>

            <div className="flex flex-col items-center">
                <Fan /> {fanSpeed} %
            </div>
        </div>
    );
};
