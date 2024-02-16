import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ControllerId } from '@/types';

export const useControllerList = () => {
    const [state, setState] = useState<ControllerId[]>([]);
    const { jwt } = useAuth();

    useEffect(() => {
        if (!jwt) return;

        fetch(import.meta.env.VITE_CONFIGURATION_API, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        }).then(response => response.json()).then(setState);
    }, [jwt]);

    return state;
};
