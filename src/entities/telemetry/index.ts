export type { LatestEvents, ModuleName } from './model/event';
export type { SummaryInterval } from './model/summary';
export { queries } from './api/queries';
export { useLatestEvents } from './lib/useLatestEvents';
export { getLastSeen, isOnline, getDeclaredModules, getModuleStates } from './lib/state';
