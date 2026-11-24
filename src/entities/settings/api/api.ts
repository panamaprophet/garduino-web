import { sendRequest } from '@/shared/api/client';
import { localToUtcTime, utcToLocalTime } from '@/shared/lib/date';
import type { Settings, SettingsPatch } from '../model/settings';

const toLocalSettings = (settings: Settings): Settings => ({
    ...settings,
    light: { ...settings.light, onTime: utcToLocalTime(settings.light.onTime) },
});

const toUtcPatch = (patch: SettingsPatch): SettingsPatch => {
    if (!patch.light?.onTime) {
        return patch;
    }

    return { ...patch, light: { ...patch.light, onTime: localToUtcTime(patch.light.onTime) } };
};

export const getSettings = async (controllerId: string) => {
    return toLocalSettings(await sendRequest<Settings>(`/v2/controllers/${controllerId}/settings`));
};

export const updateSettings = async ({ controllerId, patch }: { controllerId: string, patch: SettingsPatch }) => {
    const settings = await sendRequest<Settings>(`/v2/controllers/${controllerId}/settings`, {
        method: 'PATCH',
        body: toUtcPatch(patch),
    });

    return toLocalSettings(settings);
};
