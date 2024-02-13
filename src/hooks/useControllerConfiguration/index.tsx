import { useEffect, useState } from 'react';
import { ControllerConfiguration, ControllerId } from '@/types';
import config from '@/config';
import { useAuth } from '@/hooks/useAuth';


const getControllerConfiguration = (controllerId: ControllerId) => {
    const url = `${config.configurationApi}/${controllerId}?raw=true`;

    return fetch(url).then<ControllerConfiguration>(response => response.json());
};

const saveControllerConfiguration = ({ controllerId, ...configuration }: { controllerId: ControllerId }, options: { jwt: string }) => {
    const url = `${config.configurationApi}/${controllerId}`;
    const body = JSON.stringify(configuration);

    return fetch(url, {
        headers: { Authorization: `Bearer ${options.jwt}` },
        method: 'PUT',
        body,
    }).then(response => response.json());
};


export const useControllerConfiguration = (controllerId: ControllerId | undefined) => {
    const [state, setState] = useState<ControllerConfiguration | null>(null);
    const { jwt } = useAuth();

    useEffect(() => {
        if (!controllerId) {
            setState(null);
            return;
        }

        getControllerConfiguration(controllerId).then(setState);
    }, [controllerId]);

    const setConfiguration = (changes: Partial<ControllerConfiguration>) => setState({ ...state!, ...changes });

    const saveConfiguration = () => {
        if (!jwt) {
            throw Error('no jwt token was found');
        }

        saveControllerConfiguration({ controllerId: controllerId!, ...state }, { jwt });
    };

    return [
        state,
        setConfiguration,
        saveConfiguration,
    ] as const;
};
