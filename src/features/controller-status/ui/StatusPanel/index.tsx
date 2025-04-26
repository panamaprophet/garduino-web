import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { queries } from '@/entities/configuration';
import { ControllerStatus } from '@/entities/status';

import { Loader } from '@/shared/ui/Loader';
import { Bulb, Drop, Fan, Temperature } from '@/shared/ui/Icon';

import { usePubSubClient } from '@/shared/pubsub';

export const StatusPanel = ({ controllerId }: { controllerId: string }) => {
    const { data: configuration } = useQuery(queries.getConfiguration(controllerId));

    const [status, setStatus] = useState<ControllerStatus>();
    const [isLoading, setLoading] = useState(false);

    const updateState = () => {
        publish(`controllers/${controllerId}/status/sub`);
        setLoading(true);
    };

    const topics = {
        [`controllers/${controllerId}/status/pub`]: (data: { [k: string]: unknown }) => {
            const changes = data as unknown as ControllerStatus;

            setStatus(status => ({ ...status, ...changes, lastUpdateOn: Date.now() }));
            setLoading(false);
        },
        [`controllers/${controllerId}/events/pub`]: (data: { [k: string]: unknown }) => {
            const changes = data as unknown as Pick<ControllerStatus, 'temperature' | 'humidity' | 'isOn'>

            setStatus(status => ({ ...status!, ...changes, lastUpdateOn: Date.now() }));
            setLoading(false);
        },
    };

    const [, publish] = usePubSubClient(topics, { onConnect: updateState });

    const hasTemperatureWarning = Boolean(status && configuration && (status.temperature > configuration.thresholdTemperature));

    if (!status || isLoading) {
        return (
            <div className="flex justify-between items-center p-7 cursor-pointer" onClick={updateState}>
                <Loader status="Loading status" />
            </div>
        );
    }

    const isOn = 'isOn' in status ? (status.isOn ? 'On' : 'Off') : '-';
    const humidity = 'humidity' in status ? status.humidity : '-';
    const temperature = 'temperature' in status ? status.temperature : '-';
    const fanSpeed = 'fanSpeed' in status ? (status.fanSpeed / 255 * 100).toFixed() : '-';

    return (
        <div className="flex justify-between items-center gap-2 pt-0.5 cursor-pointer group relative" onClick={updateState}>
            <div className={`flex flex-col border p-3 grow shadow-xs gap-1 rounded-lg items-center ${status.isOn ? 'ring-2 ring-offset-2 ring-amber-500 text-amber-500' : ''}`}>
                <Bulb /> 
                <span className="text-black font-medium">{isOn}</span>
            </div>

            <div className="flex flex-col border p-3 grow shadow-xs gap-1 rounded-lg items-center">
                <Drop /> 
                <span className="text-black font-medium">{humidity}%</span>
            </div>

            <div className={`flex flex-col border p-3 grow shadow-xs gap-1 rounded-lg items-center ${hasTemperatureWarning ? 'ring-2 ring-offset-2 ring-orange-600 text-orange-600' : ''}`}>
                <Temperature /> 
                <span className="text-black font-medium">{temperature}℃</span>
            </div>

            <div className="flex flex-col border p-3 grow shadow-xs gap-1 rounded-lg items-center">
                <Fan /> 
                <span className="text-black font-medium">{fanSpeed}%</span>
            </div>
        </div>
    );
};
