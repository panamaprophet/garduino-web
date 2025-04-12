import { Bulb, Drop, Fan, Temperature } from '@/shared/ui/Icon';
import { useState } from 'react';
import { usePubSubClient } from '@/features/pubsub';
import { Loader } from '@/shared/ui/Loader';
import { useQuery } from '@tanstack/react-query';
import { queries } from '@/entities/configuration/api/queries';
import { ControllerState } from '@/entities/state';

export const StatePanel = ({ controllerId }: { controllerId: string }) => {
    const { data: configuration } = useQuery(queries.getConfiguration(controllerId));

    const [state, setState] = useState<ControllerState>();

    const updateState = () => publish(`controllers/${controllerId}/status/sub`);

    const topics = {
        [`controllers/${controllerId}/status/pub`]: (data: { [k: string]: unknown }) => {
            const changes = data as unknown as ControllerState;
            setState(state => ({ ...state, ...changes }));
        },
        [`controllers/${controllerId}/events/pub`]: (data: { [k: string]: unknown }) => {
            const changes = data as unknown as Pick<ControllerState, 'temperature' | 'humidity'>
            setState(state => ({ ...state!, ...changes }));
        },
    };

    const [, publish] = usePubSubClient(topics, { onConnect: updateState });

    const hasTemperatureWarning = Boolean(state && configuration && (state.temperature > configuration.thresholdTemperature));

    if (!state) {
        return <Loader status="Loading" />;
    }

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
                <Drop /> {humidity}%
            </div>

            <div className={`flex flex-col items-center ${hasTemperatureWarning ? 'text-red-600' : ''}`}>
                <Temperature /> {temperature}℃
            </div>

            <div className="flex flex-col items-center">
                <Fan /> {fanSpeed}%
            </div>
        </div>
    );
};
