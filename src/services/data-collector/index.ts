import { UUID } from 'crypto';
import { sendRequest } from '@/services/api';

export const getControllerHistoricalData = (
    controllerId: UUID,
    { startDate, endDate }: { startDate: number, endDate: number }
) => {
    const searchParams = new URLSearchParams();

    searchParams.append('startDate', startDate.toString());
    searchParams.append('endDate', endDate.toString());

    return sendRequest(`/data/${controllerId}?${searchParams}`);
};
