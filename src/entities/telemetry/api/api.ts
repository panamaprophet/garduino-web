import { sendRequest } from '@/shared/api/client';
import type { LatestEvents } from '../model/event';
import type { SummaryBucket, SummaryInterval } from '../model/summary';

export const getLatest = (controllerId: string) => {
    return sendRequest<LatestEvents>(`/v2/controllers/${controllerId}/telemetry/latest`);
};

export const getSummary = (controllerId: string, query: { from: string, to: string, interval: SummaryInterval }) => {
    return sendRequest<SummaryBucket[]>(`/v2/controllers/${controllerId}/telemetry/summary`, { query });
};
