import { useEffect, useState } from 'react';


const getLocationHash = () => window.location.hash.replace('#', '');

const setLocationHash = (hash: string) => { window.location.hash = hash; };

const getHashChangeEventValue = (event: HashChangeEvent) => event.newURL.split('#')[1] ?? '';


export const useLocationHash = () => {
    const [state, setState] = useState('');

    useEffect(() => {
        const onHashChange = (event: HashChangeEvent) => setState(getHashChangeEventValue(event));

        setState(getLocationHash());

        addEventListener('hashchange', onHashChange);

        return () => removeEventListener('hashchange', onHashChange);
    }, []);

    return [state, setLocationHash] as const;
}
