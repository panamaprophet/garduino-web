import { Loader } from "@/shared/ui/Loader";
import { AuthUser, signIn, getCurrentUser, signOut } from "@aws-amplify/auth";
import { ComponentType, useState, useEffect } from "react";
import { getAccessToken } from "../api";
import { LoginForm } from "../ui/LoginForm";
import { Context } from "./context";

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
