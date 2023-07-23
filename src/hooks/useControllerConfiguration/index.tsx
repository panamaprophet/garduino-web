import { useEffect, useState } from 'react';
import { ControllerConfiguration, ControllerId } from '../../types';
import config from '../../config';


const getControllerConfiguration = (controllerId: ControllerId) => {
    const url = `${config.configurationApi}/${controllerId}?raw=true`;

    return fetch(url).then<ControllerConfiguration>(response => response.json());
};

const saveControllerConfiguration = ({ controllerId, ...configuration }: { controllerId: ControllerId }) => {
    const url = `${config.configurationApi}/${controllerId}`;
    const body = JSON.stringify(configuration);

    return fetch(url, { method: 'PUT', body }).then(response => response.json());
};


export const useControllerConfiguration = (controllerId: ControllerId) => {
    const [state, setState] = useState<ControllerConfiguration | null>(null);

    useEffect(() => { getControllerConfiguration(controllerId).then(setState); }, [controllerId]);

    const setConfiguration = (changes: Partial<ControllerConfiguration>) => setState({ ...state!, ...changes });

    const saveConfiguration = () => saveControllerConfiguration({ controllerId, ...state });

    return [
        state,
        setConfiguration,
        saveConfiguration,
    ] as const;
};
