import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { queries } from '@/entities/configuration';
import { ControllerState } from '@/entities/state';

import { Loader } from '@/shared/ui/Loader';
import { Bulb, Drop, Fan, Temperature } from '@/shared/ui/Icon';

import { usePubSubClient } from '@/shared/pubsub';

export const StatePanel = ({ controllerId }: { controllerId: string }) => {
    const { data: configuration } = useQuery(queries.getConfiguration(controllerId));

    const [state, setState] = useState<ControllerState>();
    const [isLoading, setLoading] = useState(false);

    const updateState = () => {
        publish(`controllers/${controllerId}/status/sub`);
        setLoading(true);
    };

    const topics = {
        [`controllers/${controllerId}/status/pub`]: (data: { [k: string]: unknown }) => {
            const changes = data as unknown as ControllerState;
            setState(state => ({ ...state, ...changes, lastUpdateOn: Date.now() }));
            setLoading(false);
        },
        [`controllers/${controllerId}/events/pub`]: (data: { [k: string]: unknown }) => {
            const changes = data as unknown as Pick<ControllerState, 'temperature' | 'humidity'>
            setState(state => ({ ...state!, ...changes, lastUpdateOn: Date.now() }));
            setLoading(false);
        },
    };

    const [, publish] = usePubSubClient(topics, { onConnect: updateState });

    const hasTemperatureWarning = Boolean(state && configuration && (state.temperature > configuration.thresholdTemperature));

    if (!state || isLoading) {
        return (
            <div className="flex justify-between items-center p-7 cursor-pointer" onClick={updateState}>
                <Loader status="Loading" />
            </div>
        );
    }

    const isOn = 'isOn' in state ? (state.isOn ? 'On' : 'Off') : '-';
    const humidity = 'humidity' in state ? state.humidity : '-';
    const temperature = 'temperature' in state ? state.temperature : '-';
    const fanSpeed = 'fanSpeed' in state ? (state.fanSpeed / 255 * 100).toFixed() : '-';

    return (
        <div className="flex justify-between items-center p-4 cursor-pointer group relative" onClick={updateState}>
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

            {/* <div className="absolute opacity-0 group-hover:opacity-100 transition-all flex w-full h-full items-center justify-center bg-white/90">
                Refresh
            </div> */}
        </div>
    );
};
