import { queryOptions } from "@tanstack/react-query";
import { getConfiguration, getControllerIds } from ".";

export const queries = {
    listConfigurations: queryOptions({
        queryKey: ['configurations', 'list'],
        queryFn: getControllerIds,
    }),
    getConfiguration: (controllerId: string) => queryOptions({
        queryKey: ['configurations', controllerId],
        queryFn: () => getConfiguration(controllerId),
    }),
};
