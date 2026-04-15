import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { queries } from '@/entities/controller-configuration';
import { ControllerStatus } from '@/entities/controller-status';

import { Card } from '@/shared/ui/Card';
import { Bulb, Drop, Fan, Temperature } from '@/shared/ui/Icon';
import { Skeleton } from '../Skeleton';

import { usePubSubClient } from '@/shared/pubsub';

const defaultStatus: ControllerStatus = {
    isOn: false,
    humidity: 0,
    temperature: 0,
    fanSpeed: 0,
    stabilityFactor: 0,
};

export const StatusPanel = ({ controllerId }: { controllerId: string }) => {
    const { data: configuration } = useQuery(queries.getConfiguration(controllerId));

    const [status, setStatus] = useState<ControllerStatus>(defaultStatus);

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

            setStatus(status => ({ ...status, ...changes, lastUpdateOn: Date.now() }));
            setLoading(false);
        },
    };

    const [, publish] = usePubSubClient(topics, { onConnect: updateState });

    const hasTemperatureWarning = Boolean(status && configuration && (status.temperature > configuration.thresholdTemperature));

    if (!status || isLoading) {
        return <Skeleton />;
    }

    const isOn = 'isOn' in status ? (status.isOn ? 'On' : 'Off') : '-';
    const humidity = 'humidity' in status ? status.humidity : '-';
    const temperature = 'temperature' in status ? status.temperature : '-';
    const fanSpeed = 'fanSpeed' in status ? Math.trunc(status.fanSpeed / 255 * 100) : '-';

    return (
        <div className="grid auto-cols-fr grid-flow-col gap-2 pt-0.5 cursor-pointer group relative" onClick={updateState}>
            <Card className={status.isOn ? 'ring-2 ring-offset-2 ring-amber-500 text-amber-500' : ''}>
                <Bulb />
                <span className="text-slate-800 font-medium">{isOn}</span>
            </Card>

            <Card>
                <Drop />
                <span className="text-slate-800 font-medium">{humidity}%</span>
            </Card>

            <Card className={hasTemperatureWarning ? 'ring-2 ring-offset-2 ring-orange-600 text-orange-600' : ''}>
                <Temperature />
                <span className="text-slate-800 font-medium">{temperature}℃</span>
            </Card>

            <Card>
                <Fan />
                <span className="text-slate-800 font-medium">{fanSpeed}%</span>
            </Card>
        </div>
    );
};
