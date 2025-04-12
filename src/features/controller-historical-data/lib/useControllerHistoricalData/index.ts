import { useEffect, useState } from 'react';
import { UUID } from 'crypto';
import { getControllerHistoricalData } from '@/features/historical-data/api';

export const useControllerHistoricalData = (
    controllerId: UUID,
    options: Partial<{ startDate: number; endDate: number }>
) => {
    const [data, setData] = useState<unknown>([]);

    const startDate = options.startDate ?? Date.now() - 24 * 60 * 60 * 1000;
    const endDate = options.endDate ?? Date.now();

    useEffect(() => {
        getControllerHistoricalData(controllerId, { startDate, endDate }).then(setData);
    }, [startDate, endDate, controllerId]);

    return [data];
};
