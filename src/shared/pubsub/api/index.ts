import { CONNECTION_STATE_CHANGE, PubSub } from '@aws-amplify/pubsub';
import { ConnectionState, PubSubContent } from '@aws-amplify/pubsub/dist/esm/types/PubSub';
import { Hub } from 'aws-amplify/utils';

const client = new PubSub({
    endpoint: import.meta.env.VITE_WS_API,
    region: import.meta.env.VITE_REGION,
});

export const publish = (topic: string, message: PubSubContent = {}) => {
    console.log('[pubsub] publish', topic, message);

    return client.publish({ topics: [topic], message });
};

export const subscribe =
    (topic: string, callback: (data: PubSubContent) => void) => {
        console.log('[pubsub] subscribing to', topic);

        return client
            .subscribe({ topics: [topic] })
            .subscribe({
                next: callback,
                error: (error) => console.log('[pubsub] error', error),
            });
    };

export const subscribeToConnectionChange = (callback: (state: ConnectionState) => void) => {
    return Hub.listen<{ event: string; data: { connectionState: ConnectionState } }>('pubsub', ({ payload }) => {
        if (payload.event !== CONNECTION_STATE_CHANGE) {
            return;
        }

        const { data } = payload;
        const { connectionState } = data;

        console.log('[pubsub] connection changed to', connectionState);

        callback(connectionState);
    });
};
