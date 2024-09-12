import { UUID } from 'crypto';

export type Time = `${number}:${number}`;

export interface ControllerState {
    temperature: number;
    humidity: number;
    isOn: boolean;
    fanSpeed: number;
    stabilityFactor: number;
}

export interface ControllerConfiguration {
    controllerId: UUID;
    onTime: Time;
    duration: number;
    fanSpeed: number;
    thresholdTemperature: number;
}
