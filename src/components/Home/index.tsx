import { useAuth } from '../../hooks/useAuth';
import { App } from '../App';
import { LoginForm } from '../LoginForm';

export const Home = () => {
    const { isAuthenticated, signIn } = useAuth();

    if (isAuthenticated) {
        return (
            <App />
        );
    }

    return (
        <LoginForm onSubmit={signIn} />
    );
};
