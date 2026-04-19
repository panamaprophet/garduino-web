import { EventType } from './event-type';

interface TelemetryV1Event {
    event: EventType.Update;
    ts: number;
    humidity: number;
    temperature: number;
    fanSpeed: number;
}

interface TelemetryV2Event {
    event: EventType.Update;
    ts: number;
    fan?: {
        currentSpeed: number;
    };
    light?: {
        isOn: boolean;
    };
    sensor?: {
        temperature: number;
        humidity: number;
        stabilityFactor: number;
    };
}

interface RunEvent {
    event: EventType.Run;
    ts: number;
    isOn: boolean;
}

interface SwitchEvent {
    event: EventType.Switch;
    ts: number;
    isOn: boolean;
}

interface RebootEvent {
    event: EventType.Reboot;
    ts: number;
}

interface FirmwareUpdateStartedEvent {
    event: EventType.FirmwareUpdateStarted;
    ts: number;
}

interface FirmwareUpdateSuccessEvent {
    event: EventType.FirmwareUpdateSuccess;
    ts: number;
}

interface FirmwareUpdateErrorEvent {
    event: EventType.FirmwareUpdateError;
    ts: number;
    message: string;
}

type FirmwareUpdateEvent = FirmwareUpdateStartedEvent | FirmwareUpdateSuccessEvent | FirmwareUpdateErrorEvent;

type TelemetryEvent = TelemetryV1Event | TelemetryV2Event;

export type Event = TelemetryEvent | RunEvent | SwitchEvent | RebootEvent | FirmwareUpdateEvent;
