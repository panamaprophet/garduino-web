import { sendRequest } from '@/shared/api/client';
import type { LatestEvents } from '../model/event';
import type { SummaryBucket, SummaryInterval } from '../model/summary';

export const getLatestEvents = async (controllerId: string) => {
    const { data } = await sendRequest<LatestEvents>(`/v2/controllers/${controllerId}/telemetry/latest`);

    return data;
};

export const getSummary = async (controllerId: string, query: { from: string, to: string, interval: SummaryInterval }) => {
    const { data } = await sendRequest<SummaryBucket[]>(`/v2/controllers/${controllerId}/telemetry/summary`, { query });

    return data;
};
