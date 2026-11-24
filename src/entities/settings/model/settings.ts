import type { Time } from '@/shared/lib/date';

export interface Settings {
    light: {
        onTime: Time;
        durationMs: number;
    };
    fan: {
        defaultSpeed: number;
    };
    sensor: {
        thresholdTemperature: number;
    };
}

export type SettingsPatch = {
    [Module in keyof Settings]?: Partial<Settings[Module]>;
};
