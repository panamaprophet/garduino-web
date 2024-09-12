import { useEffect, useState } from 'react';
import { UUID } from 'crypto';
import { addHours, getTimeZoneOffset, subHours } from '@/helpers';
import { getConfiguration, updateConfiguration, createConfiguration } from '@/services/configuration';
import { ControllerConfiguration } from '@/types';

export const useControllerConfiguration = (controllerId: UUID | undefined) => {
    const [state, setState] = useState<ControllerConfiguration | null>(null);

    useEffect(() => {
        if (!controllerId) {
            setState(null);
            return;
        }

        getConfiguration(controllerId).then((configuration) => {
            const onTime = subHours(configuration.onTime, getTimeZoneOffset());

            setState({ ...configuration, onTime });
        });
    }, [controllerId]);

    const update = (changes: Partial<ControllerConfiguration>) => {
        if (!state) {
            throw Error('no state to update');
        }

        setState({ ...state, ...changes });

        const onTime = addHours(state.onTime, getTimeZoneOffset());

        updateConfiguration({ ...state, onTime });
    };

    const create = async () => {
        const { configuration } = await createConfiguration();

        setState(configuration);
    };

    return { state, create, update };
};
