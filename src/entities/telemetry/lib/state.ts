import type { LatestEvents, ModuleName, ModuleStates } from '../model/event';

const toTime = (ts: string | undefined) => (ts ? Date.parse(ts) : Number.NEGATIVE_INFINITY);

export const getLastSeen = (latest: LatestEvents) => {
    const newest = Math.max(...Object.values(latest).map((event) => toTime(event.ts)));

    return Number.isFinite(newest) ? newest : null;
};

export const isOnline = (latest: LatestEvents) => latest.connection?.data.online ?? false;

export const getDeclaredModules = (latest: LatestEvents) => latest.boot?.data.modules ?? null;

const getModuleState = <M extends ModuleName>(latest: LatestEvents, module: M) => {
    const { telemetry } = latest;
    const change = latest[`${module}:change`];

    if (change && toTime(change.ts) > toTime(telemetry?.ts)) {
        return (change.data as ModuleStates)[module];
    }

    return telemetry?.data[module];
};

export const getModuleStates = (latest: LatestEvents) => ({
    light: getModuleState(latest, 'light'),
    fan: getModuleState(latest, 'fan'),
    sensor: getModuleState(latest, 'sensor'),
});
