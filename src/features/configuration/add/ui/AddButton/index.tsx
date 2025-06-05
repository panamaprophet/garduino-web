import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createConfiguration } from '@/entities/controller-configuration';
import { Button } from '@/shared/ui/Button';
import { PlusIcon } from '@/shared/ui/Icon';

const download = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;
    a.download = fileName;
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
};

export const AddButton = () => {
    const { mutateAsync: create } = useMutation({ mutationFn: createConfiguration });
    const queryClient = useQueryClient();

    const onCreateController = async () => {
        const isConfirmed = confirm('Create new controller configuration?');

        if (!isConfirmed) {
            return;
        }

        const result = await create();

        download(result.certificates.root, 'root.crt');
        download(result.certificates.privateKey, 'controller.private.key');
        download(result.certificates.publicKey, 'controller.key');
        download(result.certificates.pem, 'controller.cert.pem');

        await queryClient.refetchQueries({ queryKey: ['configurations', 'list'] });

        console.log('created controller:', result);
    };

    return (
        <div className="aspect-square">
            <Button theme="secondary" onClick={onCreateController}>
                <PlusIcon className="w-4 h-4 m-0.5 text-black" />
            </Button>
        </div>
    );
}
