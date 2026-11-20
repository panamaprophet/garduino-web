import { queryOptions } from '@tanstack/react-query';
import { getSettings } from './api';

export const queries = {
    get: (controllerId: string) => queryOptions({
        queryKey: ['settings', controllerId],
        queryFn: () => getSettings(controllerId),
    }),
};
