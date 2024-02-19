import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import { App } from '@/components/App';

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
            userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
            identityPoolId: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID,
        },
    },
});

const container = document.getElementById('app');

if (!container) {
    throw Error('#app not found');
}

const root = createRoot(container);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);
