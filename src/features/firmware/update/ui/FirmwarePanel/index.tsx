import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { sendCommand } from '@/entities/controller';
import { queries, matchesVersion, type Firmware } from '@/entities/firmware';
import { isOnline, useLatestEvents } from '@/entities/telemetry';

import { Card } from '@/shared/ui/Card';
import { Check } from '@/shared/ui/Icon';
import { Button } from '@/shared/ui/Button';
import { Loader } from '@/shared/ui/Loader';
import { Divider } from '@/shared/ui/Divider';

import { formatDate } from '@/shared/lib/date';
import { getErrorMessage } from '@/shared/api/client';

import { Skeleton } from '../Skeleton';

const formatSize = (bytes: number) => `${(bytes / 1024).toFixed(0)} KB`;

const progressLabel = {
    requesting: 'Requesting update',
    sent: 'Waiting for the controller',
    started: 'Downloading firmware',
    success: 'Rebooting controller',
};

type UpdateStatus = 'started' | 'success' | 'error';

const getProgress = ({ isSending, isAwaiting, status }: { isSending: boolean, isAwaiting: boolean, status: UpdateStatus | undefined }) => {
    if (isSending) {
        return 'requesting';
    }

    if (!isAwaiting || status === 'error') {
        return null;
    }

    return status ?? 'sent';
};

export const FirmwareUpdatePanel = ({ controllerId, visibleCount = 3 }: { controllerId: string, visibleCount?: number }) => {
    const { data: firmwareList, isLoading } = useQuery(queries.list);

    const latest = useLatestEvents(controllerId, {
        timeoutMs: 5 * 60 * 1000,
        until: (newEvent) => Boolean(newEvent('boot')) || newEvent('firmware:update')?.data.status === 'error',
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

    const online = latest.data ? isOnline(latest.data) : false;
    const currentVersion = latest.data?.boot?.data.firmwareVersion ?? null;

    const update = latest.newEvent('firmware:update');
    const isRebooted = Boolean(latest.newEvent('boot'));
    const isFailed = update?.data.status === 'error';

    const progress = getProgress({ isSending, isAwaiting: latest.isAwaiting, status: update?.data.status });

    const isDisabled = !selected || !online || progress !== null;

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

            {isFailed && (
                <p className="text-sm text-red-600">
                    Update failed: {update.data.message ?? 'Unknown error'}
                </p>
            )}

            {latest.isTimedOut && (
                <p className="text-sm text-red-600">The controller didn't report the update result</p>
            )}

            {isRebooted && !isFailed && (
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
                {progress ? <Loader status={progressLabel[progress]} /> : 'Deploy'}
            </Button>
        </div>
    );
};
