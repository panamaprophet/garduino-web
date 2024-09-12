import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ControllerId } from '@/types';

export const useControllerList = () => {
    const [state, setState] = useState<ControllerId[]>([]);
    const { jwt } = useAuth();

    const refetch = () => {
        fetch(`${import.meta.env.VITE_API_URL}/configurations`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        }).then(response => response.json()).then(setState);
    };

    useEffect(() => {
        if (!jwt) {
            return;
        }

        refetch();
    }, [jwt]);

    return [state, refetch] as const;
};
