import { Hub } from 'aws-amplify/utils';
import { CONNECTION_STATE_CHANGE, ConnectionState, PubSub } from '@aws-amplify/pubsub';

const client = new PubSub({
    endpoint: import.meta.env.VITE_WS_API,
    region: import.meta.env.VITE_REGION,
});

const state = {
    connection: ConnectionState.Disconnected,
};

Hub.listen<{ event: string; data: { connectionState: ConnectionState } }>('pubsub', ({ payload }) => {
    if (payload.event !== CONNECTION_STATE_CHANGE) {
        return;
    }

    const { data } = payload;
    const { connectionState } = data;

    console.log('[pubsub] connection changed to', connectionState);

    state.connection = connectionState;
});

export const publish = (topic: string, message: Record<string, unknown> = {}) => {
    console.log('[pubsub] publish', topic, message);

    return client.publish({ topics: [topic], message });
};

export const subscribe = (topic: string, callback: (data: Record<string, unknown>) => void) => {
    console.log('[pubsub] subscribing to', topic);

    return client
        .subscribe({ topics: [topic] })
        .subscribe({
            next: callback,
            error: (error) => console.log('[pubsub] error', error),
        });
};

export const getConnectionState = () => {
    return state.connection;
};
