import type { EventType, LatestEvents, ModuleName, ModuleStates } from '../model/event';

const toTime = (ts: string | undefined) => (ts ? Date.parse(ts) : Number.NEGATIVE_INFINITY);

export const getLastSeen = (latest: LatestEvents) => {
    const timestamps = Object.values(latest).map((event) => toTime(event.ts));
    const newest = Math.max(...timestamps);

    return Number.isFinite(newest) ? newest : null;
};

export const isOnline = (latest: LatestEvents) => latest.connection?.data.online ?? false;

export const getDeclaredModules = (latest: LatestEvents) => latest.boot?.data.modules ?? null;

const getModuleState = <M extends ModuleName>(latest: LatestEvents, module: M): ModuleStates[M] | undefined => {
    const changeEvent = latest[`${module}:change`];
    const fromTelemetry = latest.telemetry?.data[module];

    if (changeEvent && toTime(changeEvent.ts) > toTime(latest.telemetry?.ts)) {
        return (changeEvent.data as ModuleStates)[module];
    }

    return fromTelemetry;
};

export const getModuleStates = (latest: LatestEvents): ModuleStates => {
    const states: ModuleStates = {};
    const light = getModuleState(latest, 'light');
    const fan = getModuleState(latest, 'fan');
    const sensor = getModuleState(latest, 'sensor');

    if (light) states.light = light;
    if (fan) states.fan = fan;
    if (sensor) states.sensor = sensor;

    return states;
};

export const hasNewEvent = (latest: LatestEvents, snapshot: LatestEvents, type: EventType) => {
    const event = latest[type];

    return Boolean(event && event.id !== snapshot[type]?.id);
};

export const getNewEvent = <T extends EventType>(latest: LatestEvents, snapshot: LatestEvents, type: T) => {
    return hasNewEvent(latest, snapshot, type) ? latest[type] : undefined;
};
