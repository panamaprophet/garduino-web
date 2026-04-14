export enum EventType {
    Run = 'run',
    Reboot = 'reboot',
    Update = 'update',
    Switch = 'switch',
    FirmwareUpdateStarted = 'firmware:update:started',
    FirmwareUpdateSuccess = 'firmware:update:success',
    FirmwareUpdateError = 'firmware:update:error',
}