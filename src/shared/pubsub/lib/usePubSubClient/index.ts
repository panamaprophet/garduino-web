import { useEffect } from 'react';
import { ConnectionState } from '@aws-amplify/pubsub';
import { getConnectionState, publish, subscribe } from '../../api';

type TopicCallback<T = any> = (data: T) => void;

type Topics = Record<string, TopicCallback>;

export const usePubSubClient = <T extends Topics = {}>(
    topics: T,
    options?: { onConnect: () => void }
) => {
    const hashKey = Object.keys(topics).sort().join('::');

    const connectionState = getConnectionState();
    const isConnected = connectionState === ConnectionState.Connected;

    useEffect(() => {
        console.log('[pubsub] subscribing to', topics);

        const subscriptions = Object.entries(topics).map(([topic, callback]) => subscribe(topic, callback));

        return () => {
            console.log('[pubsub] unsubscribing...');
            subscriptions.forEach((subscription) => subscription.unsubscribe());
        };
    }, [hashKey]);

    useEffect(() => {
        if (isConnected) {
            options?.onConnect();
        }
    }, [isConnected]);

    return [isConnected, publish] as const;
};
