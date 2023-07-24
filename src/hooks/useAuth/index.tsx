import { Auth } from 'aws-amplify';
import { useState, useEffect } from 'react';


export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        Auth.configure({ mandatorySignIn: true });

        Auth
            .currentAuthenticatedUser()
            .then(setUser)
            .then(() => setAuthenticated(true))
            .catch((error) => {
                console.log(error);
                setUser(null);
            });
    }, []);

    return {
        user,
        isAuthenticated,
        signIn: (params: { username: string, password: string }) => {
            return Auth.signIn(params).then((user) => {
                setUser(user);
                setAuthenticated(true);
            });
        },
        signOut: () => {
            return Auth.signOut().then(() => {
                setUser(null);
                setAuthenticated(false);
            });
        },
    };
};
