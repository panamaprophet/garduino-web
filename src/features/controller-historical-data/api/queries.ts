import { queryOptions } from "@tanstack/react-query";
import { getControllerHistoricalData } from ".";

export const queries = {
    historicalData: (controllerId: string, startDate: number, endDate: number) => queryOptions({
        queryKey: ['historical-data', controllerId],
        queryFn: () => getControllerHistoricalData(controllerId, { startDate, endDate }),
    }),
};
