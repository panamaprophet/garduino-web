import config from '../config';


interface ControllerConfiguration {
    controllerId: string,
    onTime: string,
    duration: number,
    fanSpeed: number,
    thresholdTemperature: number,
}


export const getControllerConfiguration = (controllerId: string) => {
    const url = `${config.configurationApi}/${controllerId}?raw=true`;

    return fetch(url).then<ControllerConfiguration>(response => response.json());
};

export const saveControllerConfiguration = ({ controllerId, ...configuration }: { controllerId: string }) => {
    const url = `${config.configurationApi}/${controllerId}`;

    return fetch(url, {
        method: 'PUT',
        body: JSON.stringify(configuration),
    }).then(response => response.json());
};
