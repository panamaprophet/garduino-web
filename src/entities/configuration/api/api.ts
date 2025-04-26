import { sendRequest } from '@/shared/api/client';
import { ControllerConfiguration } from '@/entities/configuration';
import { millisecondsToTime, timeToMilliseconds } from '@/shared/lib/date';

export const getControllerIds = () => {
    return sendRequest<string[]>('/v1/controllers');
};

export const getConfiguration = async (controllerId: string) => {
    const searchParams = new URLSearchParams({ raw: 'true' });

    const configuration = await sendRequest<ControllerConfiguration>(`/v1/controllers/${controllerId}?${searchParams}`);

    // show on time as local time adjusting the timezone difference
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const onTime = millisecondsToTime(timeToMilliseconds(configuration.onTime) - timezoneOffset);

    return { ...configuration, onTime };
};

export const updateConfiguration = ({ controllerId, ...configuration }: ControllerConfiguration) => {
    // remove the timezone offset to store the on time in utc
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const onTime = millisecondsToTime(timeToMilliseconds(configuration.onTime) + timezoneOffset);

    return sendRequest<{}>(`/v1/controllers/${controllerId}`, {
        body: JSON.stringify({ ...configuration, onTime }),
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
    }>('/v1/controllers', { method: 'POST' });
};
