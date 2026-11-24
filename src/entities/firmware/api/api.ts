import { sendRequest } from '@/shared/api/client';
import type { Firmware } from '../model/firmware';

export const listFirmware = () => sendRequest<Firmware[]>('/v2/firmware');
