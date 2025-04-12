import { useState } from 'react';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';


export const LoginForm = ({ onSubmit }: { onSubmit: (credentials: { username: string, password: string }) => void }) => {
    const [state, setState] = useState({ username: '', password: '' });

    return (
        <form className="flex flex-col gap-4 p-4 max-w-md mx-auto justify-center h-full">
            <Input
                value={state.username}
                onChange={username => setState({ ...state, username })}
                placeholder="e-mail"
                autoComplete="email"
            />

            <Input
                value={state.password}
                onChange={password => setState({ ...state, password })}
                placeholder="password"
                type="password"
                autoComplete="current-password"
            />

            <Button type="submit" onClick={(event) => {
                event.preventDefault();
                onSubmit(state);
            }}>
                Login
            </Button>
        </form>
    )
};
