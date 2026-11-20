import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { LatestEvents } from '../model/event';
import { queries } from '../api/queries';

const IDLE_INTERVAL = 30 * 1000;
const AWAIT_INTERVAL = 2500;

interface Await {
    snapshot: LatestEvents;
    deadline: number;
    isPending: boolean;
}

interface Options {
    isPolling?: boolean;
    timeoutMs?: number;
    isSettled?: (latest: LatestEvents, snapshot: LatestEvents) => boolean;
}

export const useLatestEvents = (controllerId: string, options: Options = {}) => {
    const { isPolling = false, timeoutMs = 30 * 1000, isSettled } = options;

    const [awaited, setAwaited] = useState<Await | null>(null);

    const isPending = Boolean(awaited?.isPending);

    const query = useQuery({
        ...queries.latest(controllerId),
        refetchInterval: isPending ? AWAIT_INTERVAL : (isPolling && IDLE_INTERVAL),
    });

    const { data, refetch } = query;

    useEffect(() => {
        if (!awaited?.isPending) {
            return undefined;
        }

        const settle = () => setAwaited({ ...awaited, isPending: false });

        if (data && isSettled?.(data, awaited.snapshot)) {
            settle();

            return undefined;
        }

        const timer = setTimeout(settle, Math.max(0, awaited.deadline - Date.now()));

        return () => clearTimeout(timer);
    }, [awaited, data]);

    const startAwaiting = () => {
        setAwaited({ snapshot: data ?? {}, deadline: Date.now() + timeoutMs, isPending: true });
        refetch();
    };

    const reset = () => setAwaited(null);

    return {
        ...query,
        isPending,
        snapshot: awaited?.snapshot ?? null,
        isTimedOut: Boolean(awaited && !awaited.isPending && !(data && isSettled?.(data, awaited.snapshot))),
        startAwaiting,
        reset,
    };
};
