import type { Settings, SettingsPatch } from '../model/settings';

export const getSettingsPatch = (current: Settings, draft: Settings) => {
    const modules = Object.keys(draft) as Array<keyof Settings>;

    return modules.reduce<SettingsPatch>((patch, module) => {
        const fields: Record<string, unknown> = draft[module];
        const currentFields: Record<string, unknown> = current[module];

        const changes = Object.fromEntries(
            Object.entries(fields).filter(([field, value]) => currentFields[field] !== value),
        );

        return Object.keys(changes).length ? { ...patch, [module]: changes } : patch;
    }, {});
};
