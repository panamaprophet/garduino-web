import * as Types from '../../types';
import { Bulb, Drop, Fan, Temperature } from '../Icon';

export const ControllerState = ({ state }: { state: Types.ControllerState }) => (
    <div className="flex justify-between items-center p-4">
        <div className="flex flex-col items-center">
            <Bulb /> {state.isOn ? 'On' : 'Off'}
        </div>

        <div className="flex flex-col items-center">
            <Drop /> {state.humidity + '%'}
        </div>

        <div className="flex flex-col items-center">
            <Temperature /> {state.temperature + '℃'}
        </div>

        <div className="flex flex-col items-center">
            <Fan /> {state.fanSpeed / 255 * 100 + '%'}
        </div>
    </div>
);
