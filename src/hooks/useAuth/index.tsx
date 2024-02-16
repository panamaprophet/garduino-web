import { getCurrentUser, fetchAuthSession, signIn, signOut, AuthUser } from '@aws-amplify/auth';
import { useState, useEffect } from 'react';

export const useAuth = () => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [jwt, setJwt] = useState<string | null>(null);

    const getAuthDetails = () => Promise.all([getCurrentUser(), fetchAuthSession()]);

    useEffect(() => {
        getAuthDetails()
            .then(([user, session]) => {
                setUser(user);
                setJwt(session.tokens?.idToken?.toString() ?? null);
            })
            .catch((error: unknown) => {
                console.log('[auth] error:', error);
                setUser(null);
                setJwt(null);
            });
    }, []);

    const isAuthenticated = Boolean(user && jwt);

    return {
        user,
        jwt,
        isAuthenticated,
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
};
