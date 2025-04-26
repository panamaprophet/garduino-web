import { QueryCache, QueryClient } from '@tanstack/react-query';

export const client = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            retry: false,
        },
        mutations: {
            onError: (error) => {
                console.log('[query] mutation error:', error);
            },
        },
    },
    queryCache: new QueryCache({
        onError: (error) => {
            console.log('[query] query error:', error);
        },
    }),
});
