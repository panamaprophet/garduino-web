import { useEffect, useState } from 'react';
import { PubSubContent } from '@aws-amplify/pubsub/dist/esm/types/PubSub';
import { publish, subscribe, subscribeToConnectionChange } from '../../api';

interface Params {
    [topic: string]: (data: PubSubContent) => void;
}

export const usePubSubClient = (topics: Params = {}, options?: { onConnect: () => void }) => {
    const [isConnected, setConnected] = useState(false);

    useEffect(() => {
        console.log('[pubsub] subscribing to connection change...');

        const unsubscribe = subscribeToConnectionChange((state) => {
            const isConnected = state === 'Connected';

            setConnected(isConnected);

            if (isConnected) {
                options?.onConnect();
            }
        });
        const subscibtions = Object.entries(topics).map(([topic, callback]) => subscribe(topic, callback));

        return () => {
            console.log('[pubsub] unsubscribing...');

            subscibtions.forEach(subscribtion => subscribtion.unsubscribe());

            unsubscribe();
        };
    }, [topics]);

    return [isConnected, publish] as const;
};
