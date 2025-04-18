import { createContext } from 'react';
import { AuthUser } from '../model/user';

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
