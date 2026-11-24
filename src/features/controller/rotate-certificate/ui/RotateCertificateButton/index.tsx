import { useMutation } from '@tanstack/react-query';
import { getCertificateFiles, rotateCertificate } from '@/entities/controller';
import { getErrorMessage } from '@/shared/api/client';
import { download } from '@/shared/lib/download';
import { Button } from '@/shared/ui/Button';

export const RotateCertificateButton = ({ controllerId }: { controllerId: string }) => {
    const { mutate: rotate, isPending } = useMutation({
        mutationFn: rotateCertificate,
        onSuccess: ({ certificates }) => getCertificateFiles(certificates).forEach(download),
        onError: (error) => alert(`Failed to rotate the certificate: ${getErrorMessage(error)}`),
    });

    const onClick = () => {
        const isConfirmed = confirm(
            'Issue a new device certificate? The current one is revoked at once, '
            + 'and the controller stays offline until it is flashed with the new files.',
        );

        if (!isConfirmed) {
            return;
        }

        rotate(controllerId);
    };

    return (
        <Button width="full" theme="secondary" onClick={onClick} disabled={isPending}>
            Rotate certificate
        </Button>
    );
};
