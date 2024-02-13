import { useCallback, useEffect, useState } from 'react';
import { Hub, HubCallback } from '@aws-amplify/core';
import { PubSub, CONNECTION_STATE_CHANGE } from '@aws-amplify/pubsub';

export const usePubSubClient = <Topics extends { [k: string]: any }>(topics: Topics) => {
    const [isConnected, setConnected] = useState(false);

    const publish = useCallback((topic: string, message = {}) => {
        return PubSub.publish(topic, message);
    }, []);

    const handleConnectionState: HubCallback = useCallback(({ payload }) => {
        if (payload.event !== CONNECTION_STATE_CHANGE) {
            return;
        }

        const { data } = payload;
        const { connectionState } = data;

        setConnected(connectionState === 'Connected');

        console.log('connection changed to %s', connectionState);
    }, []);

    useEffect(() => {
        const unsubscribe = Hub.listen('pubsub', handleConnectionState);

        Object
            .entries(topics)
            .forEach(([topic, callback]) => {
                PubSub
                    .subscribe(topic)
                    .subscribe({
                        next: ({ value }) => callback(value as Topics[typeof topic]),
                        error: error => console.log('pubsub error = %o', error),
                    })
            });

        return unsubscribe();
    }, []);

    return [isConnected, publish] as const;
};
