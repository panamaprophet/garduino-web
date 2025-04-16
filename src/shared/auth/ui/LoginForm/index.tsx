import { useState } from 'react';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Loader } from '@/shared/ui/Loader';
// import { Leaf } from '@/shared/ui/Icon';


export const LoginForm = ({ onSubmit }: { onSubmit: (credentials: { username: string, password: string }) => Promise<void> }) => {
    const [state, setState] = useState({ username: '', password: '' });
    const [isLoading, setLoading] = useState(false);

    return (
        <form className="flex flex-col gap-4 p-4 max-w-md mx-auto justify-center h-full">
            {/* <div className="self-center m-8 flex flex-col gap-2 font-medium items-center">
                <Leaf className="w-5 h-5 text-emerald-500" /> 
                <span className="text-slate-600">Garduino</span>
            </div> */}

            <Input
                value={state.username}
                onChange={username => setState({ ...state, username })}
                placeholder="Email"
                autoComplete="email"
            />

            <Input
                value={state.password}
                onChange={password => setState({ ...state, password })}
                placeholder="Password"
                type="password"
                autoComplete="current-password"
            />

            <Button type="submit" onClick={async (event) => {
                event.preventDefault();

                try {
                    setLoading(true); await onSubmit(state);
                } catch (error) {
                    console.log('[auth] error during sign in:', error);

                    setLoading(false);
                }
            }}>
                {isLoading && <Loader status="Sign In" />}
                {!isLoading && 'Sign In'}
            </Button>
        </form>
    )
};
