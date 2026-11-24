import { ComponentType, useEffect, useState } from 'react';
import { Loader } from '@/shared/ui/Loader';
import { getAccessToken, signIn } from '../api';
import { LoginForm } from '../ui/LoginForm';

const hasSession = async () => {
    try {
        return Boolean(await getAccessToken());
    } catch {
        return false;
    }
};

export const withAuth = <P extends {}>(Wrapped: ComponentType<P>) => {
    return (props: P) => {
        const [isAuthenticated, setAuthenticated] = useState<boolean | null>(null);

        useEffect(() => {
            hasSession().then(setAuthenticated);
        }, []);

        const onSignIn = async (credentials: { username: string, password: string }) => {
            const { isSignedIn, nextStep } = await signIn(credentials);

            if (!isSignedIn) {
                throw Error(`Sign-in requires another step: ${nextStep.signInStep}`);
            }

            setAuthenticated(true);
        };

        if (isAuthenticated === null) {
            return (
                <div className="h-full flex items-center justify-center">
                    <Loader status="Loading" />
                </div>
            );
        }

        return isAuthenticated ? <Wrapped {...props} /> : <LoginForm onSubmit={onSignIn} />;
    };
};
