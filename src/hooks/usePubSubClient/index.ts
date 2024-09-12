import { useEffect, useState } from 'react';
import { publish, subscribe, subscribeToConnectionChange } from '@/services/pubsub';
import { PubSubContent } from '@aws-amplify/pubsub/dist/esm/types/PubSub';

interface Params {
    [topic: string]: (data: PubSubContent) => void;
}

export const usePubSubClient = (topics: Params) => {
    const [isConnected, setConnected] = useState(false);

    useEffect(() => {
        if (Object.entries(topics).length === 0) {
            return;
        }

        console.log('[pubsub] subscribing to connection change...');

        const unsubscribe = subscribeToConnectionChange((state) => setConnected(state === 'Connected'));
        const subscibtions = Object.entries(topics).map(([topic, callback]) => subscribe(topic, callback));

        return () => {
            console.log('[pubsub] unsubscribing...');

            subscibtions.forEach(subscribtion => subscribtion.unsubscribe());

            unsubscribe();
        };
    }, [topics]);

    return [isConnected, publish] as const;
};
