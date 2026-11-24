export type Command =
    | { type: 'reboot' }
    | { type: 'refresh' }
    | { type: 'firmware.update', firmwareKey: string, md5: string };

export interface CommandReceipt {
    type: Command['type'];
    issuedAt: string;
}
