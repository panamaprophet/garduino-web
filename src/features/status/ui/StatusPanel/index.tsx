import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { queries } from '@/entities/controller-configuration';
import { ControllerEvent, ControllerEventType } from '@/entities/controller-event';

import { Card } from '@/shared/ui/Card';
import { Bulb, Drop, Fan, Temperature } from '@/shared/ui/Icon';
import { Skeleton } from '../Skeleton';

import { usePubSubClient } from '@/shared/pubsub';

const defaultStatus = {
    light: {
        isOn: false,
    },
    fan: {
        currentSpeed: 0,
    },
    sensor: {
        humidity: 0,
        temperature: 0,
        stabilityFactor: 0,
    },
};

export const StatusPanel = ({ controllerId }: { controllerId: string }) => {
    const { data: configuration } = useQuery(queries.getConfiguration(controllerId));

    const [status, setStatus] = useState(defaultStatus);
    const [isLoading, setLoading] = useState(false);

    const updateState = () => {
        publish(`controllers/${controllerId}/status/sub`);
        setLoading(true);
    };

    const topics = {
        [`controllers/${controllerId}/events/pub`]: (data: ControllerEvent) => {
            if (data.event === ControllerEventType.Update) {
                setStatus((status) => ({ ...status, ...data, lastUpdateOn: Date.now() }));
                setLoading(false);
            }
        },
    };

    const [, publish] = usePubSubClient(topics, { onConnect: updateState });

    const { fan, light, sensor } = status;
    const { temperature, humidity } = sensor;

    const isOn = light.isOn ? 'On' : 'Off';
    const fanSpeed = Math.trunc(fan.currentSpeed / 255 * 100);

    const temperatureThreshold = configuration?.thresholdTemperature ?? Number.POSITIVE_INFINITY;
    const hasTemperatureWarning = (temperature > temperatureThreshold);

    if (!status || isLoading) {
        return <Skeleton />;
    }

    return (
        <div className="grid auto-cols-fr grid-flow-col gap-2 pt-0.5 cursor-pointer group relative" onClick={updateState}>
            <Card className={light.isOn ? 'ring-2 ring-offset-2 ring-amber-500 text-amber-500' : ''}>
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
