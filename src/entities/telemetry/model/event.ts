export interface LightState {
    isOn: boolean;
}

export interface FanState {
    speed: number;
}

export type SensorState =
    | { temperature: number, humidity: number, stabilityFactor: number }
    | { error: string };

export interface ModuleStates {
    light?: LightState;
    fan?: FanState;
    sensor?: SensorState;
}

export type ModuleName = keyof ModuleStates;

interface BaseEvent<TType extends string, TData> {
    id: string;
    type: TType;
    ts: string;
    data: TData;
}

export type TelemetryEvent = BaseEvent<'telemetry', ModuleStates>;

export type LightChangeEvent = BaseEvent<'light:change', { light: LightState }>;

export type FanChangeEvent = BaseEvent<'fan:change', { fan: FanState }>;

export type SensorChangeEvent = BaseEvent<'sensor:change', { sensor: SensorState }>;

export type BootEvent = BaseEvent<'boot', {
    firmwareVersion: string;
    protocolVersion: number;
    modules: string[];
    resetReason: string;
}>;

export type ConnectionEvent = BaseEvent<'connection', { online: boolean, reason?: string }>;

export type SettingsAppliedEvent = BaseEvent<'settings:applied', Record<string, never>>;

export type FirmwareUpdateEvent = BaseEvent<'firmware:update', {
    status: 'started' | 'success' | 'error';
    message?: string;
}>;

export type ControllerEvent =
    | TelemetryEvent
    | LightChangeEvent
    | FanChangeEvent
    | SensorChangeEvent
    | BootEvent
    | ConnectionEvent
    | SettingsAppliedEvent
    | FirmwareUpdateEvent;

export type EventType = ControllerEvent['type'];

export type LatestEvents = {
    [E in ControllerEvent as E['type']]?: E;
};
