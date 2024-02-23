import { Loader } from '@/components/Loader';
import { LoginForm } from '@/components/LoginForm';
import { getCurrentUser, fetchAuthSession, signIn, signOut, AuthUser } from '@aws-amplify/auth';
import { useState, useEffect, createContext, useContext, ComponentType } from 'react';

const Context = createContext<{
    user: AuthUser | null;
    jwt: string | null;
    signIn: (params: { username: string; password: string }) => Promise<void>;
    signOut: () => Promise<void>;
}>({
    user: null,
    jwt: null,
    signIn: async () => { },
    signOut: async () => { },
});

export const useAuth = () => {
    const context = useContext(Context);

    if (!context) {
        throw Error('[auth] no context provider found');
    }

    return {
        ...context,
    };
};

export const withAuth = <P extends {}>(Wrapped: ComponentType<P>) => {
    return (props: P) => {
        const [user, setUser] = useState<AuthUser | null>(null);
        const [jwt, setJwt] = useState<string | null>(null);
        const [isLoading, setLoading] = useState(true);

        const getAuthDetails = () => Promise.all([getCurrentUser(), fetchAuthSession()]);

        useEffect(() => {
            (async () => {
                try {
                    console.log('[auth] fetching auth details...');

                    const [user, session] = await getAuthDetails();

                    console.log('[auth] logged in');

                    setUser(user);
                    setJwt(session.tokens?.idToken?.toString() ?? null);
                } catch (error: unknown) {
                    console.log('[auth] error:', error);

                    setUser(null);
                    setJwt(null);
                }

                setLoading(false);
            })();
        }, []);

        const isAuthenticated = Boolean(user && jwt);

        const ctx = {
            user,
            jwt,
            signIn: async (params: { username: string, password: string }) => {
                await signIn(params);
                const [user, session] = await getAuthDetails();

                setUser(user);
                setJwt(session.tokens?.idToken?.toString() ?? null);
            },
            signOut: async () => {
                await signOut();

                setUser(null);
                setJwt(null);
            },
        };

        if (isLoading) {
            return (
                <div className="h-full flex items-center justify-center">
                    <Loader status="Loading" />
                </div>
            );
        }

        return (
            <Context.Provider value={ctx}>
                {isAuthenticated ? <Wrapped {...props} /> : <LoginForm onSubmit={ctx.signIn} />}
            </Context.Provider>
        );
    };
};
