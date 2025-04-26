import { useQuery } from '@tanstack/react-query';
import { queries } from '../../api/queries';

export const useControllerHistoricalData = (
    controllerId: string,
    options: Partial<{ startDate: number; endDate: number }>
) => {
    const startDate = options.startDate ?? Date.now() - 24 * 60 * 60 * 1000;
    const endDate = options.endDate ?? Date.now();

    return useQuery(queries.historicalData(controllerId, startDate, endDate));
};
