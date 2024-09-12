import { fetchAuthSession } from '@aws-amplify/auth';
import { Amplify } from 'aws-amplify';

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
            userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
        },
    },
});

export { 
    getCurrentUser, 
    fetchAuthSession, 
    signIn, 
    signOut, 
    type AuthUser,
} from '@aws-amplify/auth';

export const getAccessToken = async () => {
    const session = await fetchAuthSession();

    return session.tokens?.accessToken?.toString();
};
