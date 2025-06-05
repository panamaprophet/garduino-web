import { ControllerEvent } from '@/entities/controller-event';
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

    return sendRequest<ControllerEvent[]>(`/v1/controllers/${controllerId}/data?${searchParams}`);
};
