import { useQuery, useMutation } from '@tanstack/react-query';

import { sendCommand } from '@/entities/controller';
import { queries as settingsQueries } from '@/entities/controller-settings';
import {
    getDeclaredModules,
    getLastSeen,
    getModuleStates,
    hasNewEvent,
    isOnline,
    useLatestEvents,
    type ModuleName,
} from '@/entities/controller-event';

import { Card } from '@/shared/ui/Card';
import { formatTimeAgo } from '@/shared/lib/date';
import { getErrorMessage } from '@/shared/api/client';
import { Bulb, Drop, Fan, Temperature } from '@/shared/ui/Icon';

import { Skeleton } from '../Skeleton';

const unknown = '—';

export const StatusPanel = ({ controllerId }: { controllerId: string }) => {
    const { data: settings } = useQuery(settingsQueries.get(controllerId));

    const latest = useLatestEvents(controllerId, {
        isPolling: true,
        isSettled: (events, snapshot) => hasNewEvent(events, snapshot, 'telemetry'),
    });

    const { mutate: refresh, error } = useMutation({
        mutationFn: sendCommand,
        onMutate: latest.startAwaiting,
        onError: latest.reset,
    });

    if (latest.isLoading || !latest.data) {
        return <Skeleton />;
    }

    const events = latest.data;
    const { light, fan, sensor } = getModuleStates(events);

    const declaredModules = getDeclaredModules(events);
    const hasModule = (module: ModuleName) => !declaredModules || declaredModules.includes(module);

    const online = isOnline(events);
    const lastSeen = getLastSeen(events);

    const readings = sensor && 'temperature' in sensor ? sensor : null;
    const sensorError = sensor && 'error' in sensor ? sensor.error : null;

    const temperatureThreshold = settings?.sensor.thresholdTemperature ?? Number.POSITIVE_INFINITY;
    const hasTemperatureWarning = readings !== null && readings.temperature > temperatureThreshold;
    const fanSpeed = fan ? `${Math.trunc(fan.speed / 255 * 100)}%` : unknown;

    const onRefresh = () => {
        if (!latest.isPending) {
            refresh({ controllerId, command: { type: 'refresh' } });
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                    <span className={`size-1.5 rounded-full ${online ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    {online ? 'Online' : 'Offline'}
                    {lastSeen !== null && ` · seen ${formatTimeAgo(lastSeen)}`}
                </span>

                {latest.isPending
                    ? <span className="animate-pulse">Refreshing…</span>
                    : <button type="button" className="cursor-pointer hover:text-slate-600" onClick={onRefresh}>Refresh</button>
                }
            </div>

            <div className="grid auto-cols-fr grid-flow-col gap-2 pt-0.5">
                {hasModule('light') && (
                    <Card className={light?.isOn ? 'ring-2 ring-offset-2 ring-amber-500 text-amber-500' : ''}>
                        <Bulb />
                        <span className="text-slate-800 font-medium">{light ? (light.isOn ? 'On' : 'Off') : unknown}</span>
                    </Card>
                )}

                {hasModule('sensor') && (
                    <Card className={sensorError ? 'ring-2 ring-offset-2 ring-red-500 text-red-500' : ''}>
                        <Drop />
                        <span className="text-slate-800 font-medium">{readings ? `${readings.humidity}%` : unknown}</span>
                    </Card>
                )}

                {hasModule('sensor') && (
                    <Card className={hasTemperatureWarning || sensorError ? 'ring-2 ring-offset-2 ring-orange-600 text-orange-600' : ''}>
                        <Temperature />
                        <span className="text-slate-800 font-medium">{readings ? `${readings.temperature}℃` : unknown}</span>
                    </Card>
                )}

                {hasModule('fan') && (
                    <Card>
                        <Fan />
                        <span className="text-slate-800 font-medium">{fanSpeed}</span>
                    </Card>
                )}
            </div>

            {sensorError && <p className="text-xs text-red-600">Sensor error: {sensorError}</p>}
            {error && <p className="text-xs text-red-600">Refresh failed: {getErrorMessage(error)}</p>}
            {latest.isTimedOut && (
                <p className="text-xs text-slate-400">The controller didn't send fresh readings</p>
            )}
        </div>
    );
};
