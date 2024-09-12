import { useState } from 'react';
import { UUID } from 'crypto';
import { getControllerIds } from '@/services/configuration';

export const useControllerList = () => {
    const [state, setState] = useState<UUID[]>([]);

    const fetcher = () => getControllerIds().then(setState);

    fetcher();

    return [state, fetcher] as const;
};
