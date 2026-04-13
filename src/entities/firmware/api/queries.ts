import { queryOptions } from '@tanstack/react-query';
import { listFirmware } from './api';

export const queries = {
    list: queryOptions({
        queryKey: ['firmware', 'list'],
        queryFn: listFirmware,
    }),
};
