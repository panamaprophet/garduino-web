import { UUID } from 'crypto';

export interface Configuration {
    controllerId: UUID;
    onTime: string;
    duration: number;
    fanSpeed: number;
    thresholdTemperature: number;
}
