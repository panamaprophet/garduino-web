import { UUID } from 'crypto';
import { Time } from '@/shared/lib/date';

export interface Configuration {
    controllerId: UUID;
    onTime: Time;
    duration: number;
    fanSpeed: number;
    thresholdTemperature: number;
}
