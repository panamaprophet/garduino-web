import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { EventType, LatestEvents } from '../model/event';
import { queries } from '../api/queries';

const IDLE_INTERVAL = 30 * 1000;
const AWAIT_INTERVAL = 2500;

type NewEvent = <T extends EventType>(type: T) => LatestEvents[T] | undefined;

interface Options {
    isPolling?: boolean;
    timeoutMs?: number;
    until?: (newEvent: NewEvent) => boolean;
}

interface Awaiting {
    snapshot: LatestEvents;
    deadline: number;
    isAwaiting: boolean;
}

export const useLatestEvents = (controllerId: string, options: Options = {}) => {
    const { isPolling = false, timeoutMs = 30 * 1000, until = () => false } = options;

    const [awaiting, setAwaiting] = useState<Awaiting | null>(null);

    const isAwaiting = Boolean(awaiting?.isAwaiting);

    const query = useQuery({
        ...queries.latest(controllerId),
        refetchInterval: isAwaiting ? AWAIT_INTERVAL : (isPolling && IDLE_INTERVAL),
    });

    const { data, refetch } = query;

    const newEvent: NewEvent = (type) => {
        const event = data?.[type];

        return awaiting && event && event.id !== awaiting.snapshot[type]?.id ? event : undefined;
    };

    const isSettled = awaiting !== null && until(newEvent);

    useEffect(() => {
        if (!awaiting?.isAwaiting) {
            return undefined;
        }

        const stop = () => setAwaiting({ ...awaiting, isAwaiting: false });

        if (isSettled) {
            stop();

            return undefined;
        }

        const timer = setTimeout(stop, Math.max(0, awaiting.deadline - Date.now()));

        return () => clearTimeout(timer);
    }, [awaiting, isSettled]);

    const startAwaiting = () => {
        setAwaiting({ snapshot: data ?? {}, deadline: Date.now() + timeoutMs, isAwaiting: true });
        refetch();
    };

    const reset = () => setAwaiting(null);

    return {
        ...query,
        isAwaiting,
        isTimedOut: awaiting !== null && !awaiting.isAwaiting && !isSettled,
        newEvent,
        startAwaiting,
        reset,
    };
};
