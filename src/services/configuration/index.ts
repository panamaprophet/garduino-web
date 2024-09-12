import { UUID } from 'crypto';
import { sendRequest } from '@/services/api';
import { ControllerConfiguration } from '@/types';

export const getControllerIds = () => {
    return sendRequest<UUID[]>('/configurations');
};

export const getConfiguration = (controllerId: UUID) => {
    const searchParams = new URLSearchParams({ raw: 'true' });

    return sendRequest<ControllerConfiguration>(`/configurations/${controllerId}?${searchParams}`);
};

export const updateConfiguration = ({ controllerId, ...configuration }: ControllerConfiguration) => {
    return sendRequest<{}>(`/configurations/${controllerId}`, {
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
        configuration: ControllerConfiguration;
    }>('/configurations', { method: 'POST' });
};
