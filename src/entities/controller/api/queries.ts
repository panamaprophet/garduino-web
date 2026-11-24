import { queryOptions } from '@tanstack/react-query';
import { getController, listControllers } from './api';

export const queries = {
    list: queryOptions({
        queryKey: ['controllers', 'list'],
        queryFn: listControllers,
    }),
    get: (controllerId: string) => queryOptions({
        queryKey: ['controllers', 'item', controllerId],
        queryFn: () => getController(controllerId),
    }),
};
