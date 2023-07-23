import config from '../config';
import { ControllerId, Time } from '../types';


interface ControllerConfiguration {
    controllerId: ControllerId,
    onTime: Time,
    duration: number,
    fanSpeed: number,
    thresholdTemperature: number,
}


export const getControllerConfiguration = (controllerId: ControllerId) => {
    const url = `${config.configurationApi}/${controllerId}?raw=true`;

    return fetch(url).then<ControllerConfiguration>(response => response.json());
};

export const saveControllerConfiguration = ({ controllerId, ...configuration }: { controllerId: ControllerId }) => {
    const url = `${config.configurationApi}/${controllerId}`;

    return fetch(url, {
        method: 'PUT',
        body: JSON.stringify(configuration),
    }).then(response => response.json());
};
