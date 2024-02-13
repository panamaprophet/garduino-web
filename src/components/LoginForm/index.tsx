import { useState } from 'react';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';


export const LoginForm = ({ onSubmit }: { onSubmit: (credentials: { username: string, password: string }) => void }) => {
    const [state, setState] = useState({ username: '', password: '' });

    return (
        <form
            onSubmit={event => event.preventDefault()}
            className="flex flex-col gap-4 p-4 max-w-md mx-auto justify-center h-full"
        >
            <Input
                value={state.username}
                onChange={username => setState({ ...state, username })}
                placeholder="e-mail"
            />

            <Input
                value={state.password}
                onChange={password => setState({ ...state, password })}
                placeholder="password"
                type="password"
            />

            <Button onClick={() => onSubmit(state)}>Login</Button>
        </form>
    )
};
