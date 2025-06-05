import { useEffect } from 'react';
import { ConnectionState } from '@aws-amplify/pubsub';
import { getConnectionState, publish, subscribe } from '../../api';

interface Topics {
    [topic: string]: (data: Record<string, unknown>) => void;
}

export const usePubSubClient = (topics: Topics = {}, options?: { onConnect: () => void }) => {
    const hashKey = Object.keys(topics).sort().join('::');

    const connectionState = getConnectionState();
    const isConnected = connectionState === ConnectionState.Connected;

    useEffect(() => {
        console.log('[pubsub] subscribing to', topics);

        const subscibtions = Object.entries(topics).map(([topic, callback]) => subscribe(topic, callback));

        return () => {
            console.log('[pubsub] unsubscribing...');
            subscibtions.forEach(subscribtion => subscribtion.unsubscribe());
        };
    }, [hashKey]);

    useEffect(() => {
        if (isConnected) {
            options?.onConnect();
        }
    }, [isConnected]);

    return [isConnected, publish] as const;
};
