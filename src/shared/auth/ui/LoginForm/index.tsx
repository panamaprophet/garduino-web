import { useState } from 'react';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Loader } from '@/shared/ui/Loader';

export const LoginForm = ({ onSubmit }: { onSubmit: (credentials: { username: string, password: string }) => Promise<void> }) => {
    const [state, setState] = useState({ username: '', password: '' });
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <form className="flex flex-col gap-4 p-4 max-w-sm mx-auto justify-center h-full">
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
                    setLoading(true);
                    setError(null);
                    await onSubmit(state);
                } catch (error) {
                    setError(error instanceof Error ? error.message : 'Sign in failed');
                } finally {
                    setLoading(false);
                }
            }}>
                {isLoading && <Loader status="Sign In" />}
                {!isLoading && 'Sign In'}
            </Button>

            {error && <p className="text-xs text-red-600 text-center">{error}</p>}
        </form>
    )
};
