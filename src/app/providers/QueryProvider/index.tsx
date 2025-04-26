import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { client } from '@/shared/api/query-client';

export const Provider = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
        {children}
    </QueryClientProvider>
);
