import { sendRequest } from '@/shared/api/client';
import type { Command, CommandReceipt } from '../model/command';
import type { Controller, ProvisionedController, RemovedController, RotatedCertificate } from '../model/controller';

export const listControllers = () => sendRequest<Controller[]>('/v2/controllers');

export const getController = (controllerId: string) => sendRequest<Controller>(`/v2/controllers/${controllerId}`);

export const createController = (name: string) => sendRequest<ProvisionedController>('/v2/controllers', {
    method: 'POST',
    body: { name },
});

export const updateController = ({ controllerId, name }: { controllerId: string, name: string }) => {
    return sendRequest<Controller>(`/v2/controllers/${controllerId}`, { method: 'PATCH', body: { name } });
};

export const removeController = (controllerId: string) => {
    return sendRequest<RemovedController>(`/v2/controllers/${controllerId}`, { method: 'DELETE' });
};

export const rotateCertificate = (controllerId: string) => {
    return sendRequest<RotatedCertificate>(`/v2/controllers/${controllerId}/certificate`, { method: 'POST' });
};

export const sendCommand = ({ controllerId, command }: { controllerId: string, command: Command }) => {
    return sendRequest<CommandReceipt>(`/v2/controllers/${controllerId}/commands`, { method: 'POST', body: command });
};
