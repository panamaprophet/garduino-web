import { queryOptions } from '@tanstack/react-query';
import type { SummaryInterval } from '../model/summary';
import { getLatestEvents, getSummary } from './api';

export const queries = {
    latest: (controllerId: string) => queryOptions({
        queryKey: ['telemetry', controllerId, 'latest'],
        queryFn: () => getLatestEvents(controllerId),
    }),
    summary: (controllerId: string, from: string, to: string, interval: SummaryInterval) => queryOptions({
        queryKey: ['telemetry', controllerId, 'summary', from, to, interval],
        queryFn: () => getSummary(controllerId, { from, to, interval }),
        staleTime: 5 * 60 * 1000,
    }),
};
