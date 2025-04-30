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

    return sendRequest<(
        { ts: number; event: 'run', isOn: boolean; } |
        { ts: number; event: 'switch', isOn: boolean } |
        { ts: number; event: 'update', humidity: number; temperature: number; fanSpeed: number }
    )[]>(`/v1/controllers/${controllerId}/data?${searchParams}`);
};
