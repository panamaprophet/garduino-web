import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createConfiguration } from '@/entities/configuration';
import { Button } from '@/shared/ui/Button';
import { PlusIcon } from '@/shared/ui/Icon';

export const AddButton = () => {
    const { mutateAsync: create } = useMutation({ mutationFn: createConfiguration });
    const queryClient = useQueryClient();

    const onCreateController = async () => {
        const isConfirmed = confirm('Create new controller configuration?');

        if (!isConfirmed) {
            return;
        }

        const result = await create();

        await queryClient.invalidateQueries({ queryKey: ['controllers', 'list'] });

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
