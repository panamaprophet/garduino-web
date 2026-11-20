import type { Firmware } from '../model/firmware';

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const matchesVersion = (firmware: Firmware, version: string) => {
    const pattern = new RegExp(`(?<![\\d.])${escape(version)}(?!\\w|\\.\\d)`);

    return pattern.test(firmware.key);
};
