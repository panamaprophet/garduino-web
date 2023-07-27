import { Auth } from 'aws-amplify';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { useState, useEffect } from 'react';


export const useAuth = () => {
    const [user, setUser] = useState<CognitoUser | null>(null);
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [jwt, setJwt] = useState(null);

    useEffect(() => {
        Auth.configure({ mandatorySignIn: true });

        Auth
            .currentAuthenticatedUser()
            .then(user => {
                setUser(user);
                setJwt(user.signInUserSession.idToken.jwtToken);
            })
            .then(() => setAuthenticated(true))
            .catch((error) => {
                console.log(error);
                setUser(null);
            });
    }, []);

    return {
        user,
        jwt,
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
