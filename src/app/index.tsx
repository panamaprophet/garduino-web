import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/pages/dashboard';
import { QueryProvider } from './providers';

const container = document.getElementById('app');

if (!container) {
    throw Error('#app not found');
}

const root = createRoot(container);

root.render(
    <StrictMode>
        <QueryProvider>
            <App />
        </QueryProvider>
    </StrictMode>
);
