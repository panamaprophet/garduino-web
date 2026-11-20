import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { sendCommand } from '@/entities/controller';
import { queries, matchesVersion, type Firmware } from '@/entities/firmware';
import { getNewEvent, hasNewEvent, isOnline, useLatestEvents, type LatestEvents } from '@/entities/controller-event';

import { Card } from '@/shared/ui/Card';
import { Check } from '@/shared/ui/Icon';
import { Button } from '@/shared/ui/Button';
import { Loader } from '@/shared/ui/Loader';
import { Divider } from '@/shared/ui/Divider';

import { formatDate } from '@/shared/lib/date';
import { getErrorMessage } from '@/shared/api/client';

import { Skeleton } from '../Skeleton';

type UpdateStatus = 'idle' | 'requesting' | 'sent' | 'started' | 'success' | 'done' | 'error' | 'timeout';

const formatSize = (bytes: number) => `${(bytes / 1024).toFixed(0)} KB`;

const buttonLabel: Record<UpdateStatus, string> = {
    idle: 'Deploy',
    requesting: 'Requesting update',
    sent: 'Waiting for the controller',
    started: 'Downloading firmware',
    success: 'Rebooting controller',
    done: 'Deploy',
    error: 'Deploy',
    timeout: 'Deploy',
};

const progressStatuses: UpdateStatus[] = ['requesting', 'sent', 'started', 'success'];

const isUpdateSettled = (events: LatestEvents, snapshot: LatestEvents) => {
    const update = getNewEvent(events, snapshot, 'firmware:update');

    return hasNewEvent(events, snapshot, 'boot') || update?.data.status === 'error';
};

const getUpdateStatus = (events: LatestEvents | undefined, snapshot: LatestEvents | null, isPending: boolean): UpdateStatus => {
    if (!events || !snapshot) {
        return 'idle';
    }

    const update = getNewEvent(events, snapshot, 'firmware:update');

    if (update?.data.status === 'error') {
        return 'error';
    }

    if (hasNewEvent(events, snapshot, 'boot')) {
        return 'done';
    }

    if (update) {
        return update.data.status;
    }

    return isPending ? 'sent' : 'timeout';
};

export const FirmwareUpdatePanel = ({ controllerId, visibleCount = 3 }: { controllerId: string, visibleCount?: number }) => {
    const { data: firmwareList, isLoading } = useQuery(queries.list);

    const latest = useLatestEvents(controllerId, {
        timeoutMs: 5 * 60 * 1000,
        isSettled: isUpdateSettled,
    });

    const { mutate: deploy, isPending: isSending, error: sendError } = useMutation({
        mutationFn: sendCommand,
        onMutate: latest.startAwaiting,
        onError: latest.reset,
    });

    const [selected, setSelected] = useState<Firmware | null>(null);
    const [showAll, setShowAll] = useState(false);

    const onDeploy = () => {
        if (!selected) {
            return;
        }

        const isConfirmed = confirm('Deploy firmware to the controller? The controller will reboot after update.');

        if (!isConfirmed) {
            return;
        }

        deploy({
            controllerId,
            command: { type: 'firmware.update', firmwareKey: selected.key, md5: selected.md5 },
        });
    };

    if (isLoading) {
        return <Skeleton />;
    }

    if (!firmwareList?.length) {
        return (
            <div className="flex justify-between items-center p-7">
                <p className="text-slate-400">No firmware available</p>
            </div>
        );
    }

    const events = latest.data;
    const online = events ? isOnline(events) : false;
    const currentVersion = events?.boot?.data.firmwareVersion ?? null;
    const updateError = events && latest.snapshot ? getNewEvent(events, latest.snapshot, 'firmware:update') : undefined;

    const updateStatus = isSending ? 'requesting' : getUpdateStatus(events, latest.snapshot, latest.isPending);
    const isUpdating = progressStatuses.includes(updateStatus);
    const isDisabled = !selected || !online || isUpdating;

    const visibleList = showAll ? firmwareList : firmwareList.slice(0, visibleCount);
    const hasMore = firmwareList.length > visibleCount;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                {visibleList.map((item) => (
                    <Card
                        key={item.key}
                        className={selected?.key === item.key
                            ? 'relative items-start ring-2 ring-offset-2 ring-emerald-500'
                            : 'relative items-start hover:border-slate-300'
                        }
                        onClick={() => setSelected(item)}
                    >
                        <span className="font-medium text-slate-800 overflow-hidden text-ellipsis whitespace-nowrap max-w-full pr-6">
                            {item.key}
                        </span>
                        <span className="text-xs text-slate-400">
                            {formatDate(item.lastModified)} · {formatSize(item.size)}
                        </span>
                        {currentVersion && matchesVersion(item, currentVersion) && (
                            <Check className={`
                                size-5
                                absolute top-1/2 right-2 -translate-y-1/2
                                text-slate-300/80
                                transition-all transition-duration-300
                            `} />
                        )}
                    </Card>
                ))}

                {hasMore && !showAll && (
                    <Button width="full" theme="secondary" onClick={() => setShowAll(true)}>
                        Show more ({firmwareList.length - visibleCount})
                    </Button>
                )}
            </div>

            <Divider />

            {currentVersion && (
                <p className="text-xs text-slate-400">Running firmware {currentVersion}</p>
            )}

            {!online && (
                <p className="text-xs text-slate-400">The controller is offline, updates can't be delivered</p>
            )}

            {updateStatus === 'error' && (
                <p className="text-sm text-red-600">
                    Update failed: {updateError?.data.message ?? 'Unknown error'}
                </p>
            )}

            {updateStatus === 'timeout' && (
                <p className="text-sm text-red-600">The controller didn't report the update result</p>
            )}

            {updateStatus === 'done' && (
                <p className="text-sm text-emerald-600">Controller restarted with firmware {currentVersion}</p>
            )}

            {sendError && (
                <p className="text-sm text-red-600">{getErrorMessage(sendError)}</p>
            )}

            <Button
                width="full"
                onClick={onDeploy}
                disabled={isDisabled}
            >
                {isUpdating ? <Loader status={buttonLabel[updateStatus]} /> : buttonLabel[updateStatus]}
            </Button>
        </div>
    );
};
