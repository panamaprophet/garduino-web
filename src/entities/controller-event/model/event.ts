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

interface FirmwareUpdateEvent {
    event:
        | EventType.FirmwareUpdateStarted
        | EventType.FirmwareUpdateSuccess
        | EventType.FirmwareUpdateError
        ;
    ts: number;
}

export type Event = UpdateEvent | RunEvent | SwitchEvent | RebootEvent | FirmwareUpdateEvent;
