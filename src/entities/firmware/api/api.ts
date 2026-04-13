import { sendRequest } from '@/shared/api/client';
import { Firmware, FirmwareVersion } from '@/entities/firmware';

export const listFirmware = () => {
    return sendRequest<Firmware[]>('/v1/firmware');
};

export const getDownloadUrl = (key: string) => {
    const searchParams = new URLSearchParams({ key });

    return sendRequest<FirmwareVersion>(`/v1/firmware/download?${searchParams}`);
};
