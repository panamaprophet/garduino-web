import { useMutation } from '@tanstack/react-query';
import { sendCommand } from '@/entities/controller';
import { useLatestEvents } from '@/entities/telemetry';
import { getErrorMessage } from '@/shared/api/client';
import { Button } from '@/shared/ui/Button';
import { Loader } from '@/shared/ui/Loader';

export const RebootButton = ({ controllerId }: { controllerId: string }) => {
    const latest = useLatestEvents(controllerId, {
        timeoutMs: 60 * 1000,
        until: (newEvent) => Boolean(newEvent('boot')),
    });

    const { mutate: reboot, isPending: isSending } = useMutation({
        mutationFn: sendCommand,
        onMutate: latest.startAwaiting,
        onError: (error) => {
            latest.reset();
            alert(`Failed to reboot the controller: ${getErrorMessage(error)}`);
        },
    });

    const onClick = () => {
        const isConfirmed = confirm('Reboot the controller?');

        if (!isConfirmed) {
            return;
        }

        reboot({ controllerId, command: { type: 'reboot' } });
    };

    const isBusy = isSending || latest.isAwaiting;

    return (
        <div className="flex flex-col gap-2">
            <Button width="full" theme="secondary" onClick={onClick} disabled={isBusy}>
                {isBusy ? <Loader status="Rebooting" /> : 'Reboot'}
            </Button>

            {latest.isTimedOut && (
                <p className="text-xs text-slate-400 text-center">
                    The controller hasn't reported a boot yet
                </p>
            )}
        </div>
    );
};
