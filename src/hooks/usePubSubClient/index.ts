import { useCallback, useEffect, useState } from 'react';
import { Hub } from 'aws-amplify/utils';
import { PubSub, CONNECTION_STATE_CHANGE, ConnectionState } from '@aws-amplify/pubsub';

const client = new PubSub({
    endpoint: import.meta.env.VITE_WS_API,
    region: import.meta.env.VITE_REGION,
});

const isEmpty = <T extends object>(obj: T) => {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
            return false;
        }
    }

    return true;
};

export const usePubSubClient = <Topics extends { [k: string]: any }>(topics: Topics) => {
    const [isConnected, setConnected] = useState(false);

    const publish = useCallback((topic: string, message = {}) => {
        console.log(`[pubsub] publish to ${topic}:`, message);

        return client?.publish({ topics: topic, message });
    }, []);

    useEffect(() => {
        if (isEmpty(topics)) {
            console.log('[pubsub] no topics to subscribe. terminating...');
            return;
        }

        console.log('[pubsub] subscribing to connection change...');

        const unsubscribe = Hub.listen('pubsub', ({ payload }: {
            payload: {
                event: string;
                data: { connectionState: ConnectionState };
            };
        }) => {
            console.log('[pubsub] pubsub event happened', payload);

            if (payload.event !== CONNECTION_STATE_CHANGE) {
                return;
            }

            const { data } = payload;
            const { connectionState } = data;

            setConnected(connectionState === 'Connected');

            console.log('[pubsub] connection changed to', connectionState);
        });

        const subscibtions = Object
            .entries(topics)
            .map(([topic, callback]) => {
                console.log('[pubsub] subscribing to', topic);

                return client!
                    .subscribe({ topics: [topic] })
                    .subscribe({
                        next: (data) => {
                            console.log('[pubsub] message:', data);
                            return callback(data as Topics[typeof topic]);
                        },
                        error: error => console.log('[pubsub] error:', error),
                    })
            });

        return () => {
            console.log('[pubsub] unsubscribing...');

            subscibtions.forEach(subscribtion => subscribtion.unsubscribe());

            unsubscribe();
        };
    }, [topics]);

    return [isConnected, publish] as const;
};
