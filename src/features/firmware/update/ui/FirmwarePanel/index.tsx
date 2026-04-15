import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { ControllerEventType } from '@/entities/controller-event';
import { queries, getDownloadUrl } from '@/entities/firmware';

import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Loader } from '@/shared/ui/Loader';
import { Divider } from '@/shared/ui/Divider';

import { formatDate } from '@/shared/lib/date';
import { usePubSubClient } from '@/shared/pubsub';

import { Skeleton } from '../Skeleton';

type UpdateStatus = 'idle' | 'requesting' | 'started' | 'success' | 'error';

const formatSize = (bytes: number) => `${(bytes / 1024).toFixed(0)} KB`;

const buttonLabel: Record<UpdateStatus, string> = {
    idle: 'Deploy',
    requesting: 'Requesting update',
    started: 'Downloading firmware',
    success: 'Rebooting controller',
    error: 'Update failed',
};

export const FirmwareUpdatePanel = ({ controllerId, visibleCount = 3 }: { controllerId: string, visibleCount?: number }) => {
    const { data: firmwareList, isLoading } = useQuery(queries.list);
    const { mutateAsync: getUrl } = useMutation({ mutationFn: getDownloadUrl });

    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [updateStatus, setUpdateStatus] = useState<UpdateStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [showAll, setShowAll] = useState(false);

    const topics = {
        [`controllers/${controllerId}/events/pub`]: (data: Record<string, unknown>) => {
            const { event, message } = data;

            if (event === ControllerEventType.FirmwareUpdateStarted) {
                setUpdateStatus('started');
            }

            if (event === ControllerEventType.FirmwareUpdateSuccess) {
                setUpdateStatus('success');
            }

            if (event === ControllerEventType.FirmwareUpdateError) {
                setUpdateStatus('error');
                setErrorMessage(String(message ?? 'Unknown error'));
            }

            if (event === ControllerEventType.Run) {
                setUpdateStatus('idle');
                setErrorMessage(null);
            }
        },
    };

    const [isConnected, publish] = usePubSubClient(topics);

    const onDeploy = async () => {
        if (!selectedKey) {
            return;
        }

        const isConfirmed = confirm('Deploy firmware to the controller? The controller will reboot after update.');

        if (!isConfirmed) {
            return;
        }

        setUpdateStatus('requesting');
        setErrorMessage(null);

        const { url, md5 } = await getUrl(selectedKey);
        const baseUrl = url.split('?').at(0);

        publish(`controllers/${controllerId}/firmware/update/sub`, { url: baseUrl, md5 });
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

    const visibleList = showAll ? firmwareList : firmwareList.slice(0, visibleCount);
    const hasMore = firmwareList.length > visibleCount;

    const isUpdating = updateStatus === 'requesting' || updateStatus === 'started';
    const isDisabled = !selectedKey || !isConnected || isUpdating;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                {visibleList.map((item) => (
                    <Card
                        key={item.key}
                        className={selectedKey === item.key
                            ? 'items-start ring-2 ring-offset-2 ring-emerald-500'
                            : 'items-start hover:border-slate-300'
                        }
                        onClick={() => setSelectedKey(item.key)}
                    >
                        <span className="font-medium text-slate-800">{item.key}</span>
                        <span className="text-xs text-slate-400">
                            {formatDate(item.lastModified)} · {formatSize(item.size)}
                        </span>
                    </Card>
                ))}

                {hasMore && !showAll && (
                    <Button width="full" theme="secondary" onClick={() => setShowAll(true)}>
                        Show more ({firmwareList.length - visibleCount})
                    </Button>
                )}
            </div>

            <Divider />

            {updateStatus === 'error' && (
                <p className="text-sm text-red-600">
                    {errorMessage ?? 'Unknown error'}
                </p>
            )}

            <Button
                width="full"
                onClick={onDeploy}
                disabled={isDisabled}
            >
                {isUpdating && <Loader status={buttonLabel[updateStatus]} />}
                {updateStatus === 'success' && buttonLabel[updateStatus]}
                {updateStatus === 'error' && buttonLabel[updateStatus]}
                {updateStatus === 'idle' && buttonLabel[updateStatus]}
            </Button>
        </div>
    );
};
