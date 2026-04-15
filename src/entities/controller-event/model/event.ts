import { EventType } from './event-type';

interface UpdateEvent {
    event: EventType.Update;
    ts: number;
    humidity: number;
    temperature: number;
    fanSpeed: number;
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

export type Event = UpdateEvent | RunEvent | SwitchEvent | RebootEvent | FirmwareUpdateEvent;
