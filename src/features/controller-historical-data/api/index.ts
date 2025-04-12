import { sendRequest } from '@/shared/api/client';

export const getControllerHistoricalData = (
    controllerId: string,
    options: { startDate?: number, endDate?: number } = {}
) => {
    const searchParams = new URLSearchParams();
    const { startDate, endDate } = options;

    if (startDate) {
        searchParams.append('startDate', startDate.toString());
    }

    if (endDate) {
        searchParams.append('endDate', endDate.toString());
    }

    return sendRequest(`/data/${controllerId}?${searchParams}`);
};
