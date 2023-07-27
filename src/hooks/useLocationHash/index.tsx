import { useEffect, useState } from 'react';

export const useLocationHash = () => {
    const [state, setState] = useState('');

    useEffect(() => {
        const initialState = window.location.hash.replace('#', '');

        setState(initialState);

        const onHashChange = (event: HashChangeEvent) => {
            const newState = event.newURL.split('#')[1] ?? '';

            setState(newState);
        }

        addEventListener('hashchange', onHashChange);

        return () => removeEventListener('hashchange', onHashChange);
    }, []);

    const setLocationHash = (hash: string) => window.location.hash = hash;

    return [state, setLocationHash] as const;
}
