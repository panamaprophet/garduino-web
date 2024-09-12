import { useEffect, useState } from 'react';
import { ControllerConfiguration, ControllerId } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { addHours, getTimeZoneOffset, subHours } from '@/helpers';

const getControllerConfiguration = (controllerId: ControllerId, options: { jwt: string }) => {
    const url = `${import.meta.env.VITE_API_URL}/configurations/${controllerId}?raw=true`;

    return fetch(url, {
        headers: { Authorization: `Bearer ${options.jwt}` },
    }).then<ControllerConfiguration>(response => response.json());
};

const saveControllerConfiguration = ({ controllerId, ...configuration }: ControllerConfiguration, options: { jwt: string }) => {
    const url = `${import.meta.env.VITE_API_URL}/configurations/${controllerId}`;
    const body = JSON.stringify(configuration);

    return fetch(url, {
        headers: { Authorization: `Bearer ${options.jwt}` },
        method: 'PUT',
        body,
    }).then(response => response.json());
};

const createControllerConfiguration = (options: { jwt: string }): Promise<{
    id: string;
    arn: string;
    certificates: {
        root: string;
        pem: string;
        privateKey: string;
        publicKey: string;
    },
    configuration: ControllerConfiguration;
}> => {
    const url = `${import.meta.env.VITE_API_URL}/configurations`;

    return fetch(url, {
        headers: { Authorization: `Bearer ${options.jwt}` },
        method: 'POST',
    }).then(response => response.json());
}

export const useControllerConfiguration = (controllerId: ControllerId | undefined) => {
    const [state, setState] = useState<ControllerConfiguration | null>(null);
    const { jwt } = useAuth();

    useEffect(() => {
        if (!jwt) {
            return;
        }

        if (!controllerId) {
            setState(null);
            return;
        }

        getControllerConfiguration(controllerId, { jwt }).then((configuration) => {
            const onTime = subHours(configuration.onTime, getTimeZoneOffset());

            setState({ ...configuration, onTime });
        });
    }, [jwt, controllerId]);

    const setConfiguration = (changes: Partial<ControllerConfiguration>) => setState({ ...state!, ...changes });

    const saveConfiguration = () => {
        if (!jwt) {
            throw Error('no jwt token was found');
        }

        if (!state) {
            throw Error('state is empty');
        }

        const onTime = addHours(state.onTime, getTimeZoneOffset());

        saveControllerConfiguration({ ...state, onTime }, { jwt });
    };

    const createConfiguration = async () => {
        if (!jwt) {
            throw Error('no jwt token');
        }

        const { configuration } = await createControllerConfiguration({ jwt });

        setState(configuration);
    };

    return [
        state,
        setConfiguration,
        saveConfiguration,
        createConfiguration,
    ] as const;
};
