import { useCallback, useState } from 'react';
import { PubSub, Hub } from 'aws-amplify';
import { CONNECTION_STATE_CHANGE } from '@aws-amplify/pubsub';


export const usePubSubClient = (topics: { [k: string]: (message: any) => void }) => {
    const [isConnected, setConnected] = useState(false);
    const publish = useCallback((topic: string, message = {}) => PubSub.publish(topic, message), []);

    Hub.listen('pubsub', ({ payload }: any) => {
        if (payload.event !== CONNECTION_STATE_CHANGE) {
            return;
        }

        const { data } = payload;
        const { connectionState } = data;

        setConnected(connectionState === 'Connected');

        console.log('connection changed to %s', connectionState);
    });

    Object
        .entries(topics)
        .forEach(([topic, callback]) => {
            PubSub
                .subscribe(topic)
                .subscribe({
                    next: ({ value }) => callback(value),
                    error: error => console.log('pubsub error = %o', error),
                })
        });

    return [isConnected, publish] as const;
};
