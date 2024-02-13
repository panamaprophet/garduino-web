import { useAuth } from '@/hooks/useAuth';
import { App } from '@/components/App';
import { LoginForm } from '@/components/LoginForm';

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
