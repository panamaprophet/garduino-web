import { queryOptions } from "@tanstack/react-query";
import { getControllerHistoricalData } from "./api";

export const queries = {
    historicalData: (controllerId: string, startDate: number, endDate: number) => queryOptions({
        queryKey: ['historical-data', controllerId, startDate, endDate],
        queryFn: () => getControllerHistoricalData(controllerId, { startDate, endDate }),
        staleTime: 5 * 60 * 1000,
    }),
};
