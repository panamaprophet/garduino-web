import { sendRequest } from '@/shared/api/client';
import { Configuration } from '@/entities/configuration/model/configuration';

export const getControllerIds = () => {
    return sendRequest<string[]>('/v1/controllers');
};

export const getConfiguration = (controllerId: string) => {
    const searchParams = new URLSearchParams({ raw: 'true' });

    return sendRequest<Configuration>(`/v1/controllers/${controllerId}?${searchParams}`);
};

export const updateConfiguration = ({ controllerId, ...configuration }: Configuration) => {
    return sendRequest<{}>(`/v1/controllers/${controllerId}`, {
        body: JSON.stringify(configuration),
        method: 'PUT',
    });
};

export const createConfiguration = () => {
    return sendRequest<{
        id: string;
        arn: string;
        certificates: {
            root: string;
            pem: string;
            privateKey: string;
            publicKey: string;
        },
        configuration: Configuration;
    }>('/v1/controllers', { method: 'POST' });
};
