import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import { Home } from '@/components/Home';
import config from './config';
config

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: config.cognitoUserPoolId,
            userPoolClientId: config.cognitoUserPoolClientId,
            identityPoolId: config.cognitoIdentityPoolId,
        },
    },
});

const container = document.getElementById('app')!;
const root = createRoot(container);

root.render(<Home />);
