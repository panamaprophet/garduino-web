import { Bulb, Drop, Fan, Temperature } from '../Icon';
import { ControllerState } from '../../types';


export const ControllerStatePanel = ({ state }: { state: ControllerState }) => (
    <div className="flex justify-between items-center p-4">
        <div className="flex flex-col items-center">
            <Bulb /> {state.isOn ? 'On' : 'Off'}
        </div>

        <div className="flex flex-col items-center">
            <Drop /> {state.humidity ?? '-'} %
        </div>

        <div className="flex flex-col items-center">
            <Temperature /> {state.temperature ?? '-'} ℃
        </div>

        <div className="flex flex-col items-center">
            <Fan /> {state.fanSpeed ? (state.fanSpeed/ 255 * 100 | 0) : '-'} %
        </div>
    </div>
);
