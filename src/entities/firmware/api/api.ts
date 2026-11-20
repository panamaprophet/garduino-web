import { sendRequest } from '@/shared/api/client';
import type { Firmware } from '../model/firmware';

export const listFirmware = async () => {
    const { data } = await sendRequest<Firmware[]>('/v2/firmware');

    return data;
};
