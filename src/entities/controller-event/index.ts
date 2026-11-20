export type {
    Event as ControllerEvent,
    EventType as ControllerEventType,
    LatestEvents,
    ModuleName,
    ModuleStates,
    LightState,
    FanState,
    SensorState,
    BootEvent,
    FirmwareUpdateEvent,
} from './model/event';
export type { SummaryBucket, SummaryInterval, Reading } from './model/summary';
export { queries } from './api/queries';
export { useLatestEvents } from './lib/useLatestEvents';
export {
    getLastSeen,
    isOnline,
    getDeclaredModules,
    getModuleStates,
    hasNewEvent,
    getNewEvent,
} from './lib/state';
