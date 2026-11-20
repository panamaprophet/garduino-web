import { sendRequest } from '@/shared/api/client';
import type { Command, CommandReceipt } from '../model/command';
import type { Controller, ProvisionedController, RemovedController, RotatedCertificate } from '../model/controller';

export const listControllers = async () => {
    const { data } = await sendRequest<Controller[]>('/v2/controllers');

    return data;
};

export const getController = async (controllerId: string) => {
    const { data } = await sendRequest<Controller>(`/v2/controllers/${controllerId}`);

    return data;
};

export const createController = async (name: string) => {
    const { data } = await sendRequest<ProvisionedController>('/v2/controllers', {
        method: 'POST',
        body: { name },
    });

    return data;
};

export const renameController = async ({ controllerId, name }: { controllerId: string, name: string }) => {
    const { data } = await sendRequest<Controller>(`/v2/controllers/${controllerId}`, {
        method: 'PATCH',
        body: { name },
    });

    return data;
};

export const removeController = async (controllerId: string) => {
    const { data } = await sendRequest<RemovedController>(`/v2/controllers/${controllerId}`, {
        method: 'DELETE',
    });

    return data;
};

export const rotateCertificate = async (controllerId: string) => {
    const { data } = await sendRequest<RotatedCertificate>(`/v2/controllers/${controllerId}/certificate`, {
        method: 'POST',
    });

    return data;
};

export const sendCommand = async ({ controllerId, command }: { controllerId: string, command: Command }) => {
    const { data } = await sendRequest<CommandReceipt>(`/v2/controllers/${controllerId}/commands`, {
        method: 'POST',
        body: command,
    });

    return data;
};
