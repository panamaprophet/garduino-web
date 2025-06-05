interface UpdateEvent {
    event: 'update';
    ts: number;
    humidity: number;
    temperature: number;
    fanSpeed: number;
}

interface RunEvent {
    event: 'run';
    ts: number;
    isOn: boolean;
}

interface SwitchEvent {
    event: 'switch';
    ts: number;
    isOn: boolean;
}

interface RebootEvent {
    event: 'reboot';
    ts: number;
}

export type Event = UpdateEvent | RunEvent | SwitchEvent | RebootEvent;
