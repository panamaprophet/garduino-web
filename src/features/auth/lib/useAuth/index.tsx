import { useState, useEffect, ComponentType, createContext, useContext } from 'react';
import { AuthUser, getAccessToken, getCurrentUser, signIn, signOut } from '@/features/auth/api';
import { Loader } from '@/shared/ui/Loader';
import { LoginForm } from '@/features/auth/ui/LoginForm';

interface AuthContext {
    user: AuthUser | null;
    jwt: string | null;
    signIn: (params: { username: string; password: string }) => Promise<void>;
    signOut: () => Promise<void>;
}

export const Context = createContext<AuthContext>({
    user: null,
    jwt: null,
    signIn: async () => {},
    signOut: async () => {},
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

        const isAuthenticated = Boolean(user && jwt);

        const ctx = {
            user,
            jwt,
            signIn: async (params: { username: string, password: string }) => {
                await signIn(params);

                const accessToken = await getAccessToken();
                const user = await getCurrentUser().catch(() => null);

                setUser(user);
                setJwt(accessToken ?? null);
            },
            signOut: async () => {
                await signOut();

                setUser(null);
                setJwt(null);
            },
        };

        useEffect(() => {
            (async () => {
                try {
                    console.log('[auth] fetching auth details...');

                    const accessToken = await getAccessToken();
                    const user = await getCurrentUser().catch(() => null);

                    setUser(user);
                    setJwt(accessToken ?? null);
                } catch (error: unknown) {
                    console.log('[auth] error:', error);

                    setUser(null);
                    setJwt(null);
                }

                setLoading(false);
            })();
        }, []);

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
