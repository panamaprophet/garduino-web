import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createController, getDeviceFiles, queries } from '@/entities/controller';
import { getErrorMessage } from '@/shared/api/client';
import { download } from '@/shared/lib/download';
import { Button } from '@/shared/ui/Button';
import { PlusIcon } from '@/shared/ui/Icon';

export const AddButton = ({ onCreated }: { onCreated?: (controllerId: string) => void }) => {
    const queryClient = useQueryClient();

    const { mutate: create, isPending } = useMutation({
        mutationFn: createController,
        onSuccess: async (controller) => {
            getDeviceFiles(controller).forEach(download);

            await queryClient.invalidateQueries({ queryKey: queries.list.queryKey });

            onCreated?.(controller.controllerId);
        },
        onError: (error) => alert(`Failed to create the controller: ${getErrorMessage(error)}`),
    });

    const onClick = () => {
        const name = prompt('Name of the new controller:')?.trim();

        if (!name) {
            return;
        }

        if (name.length > 64) {
            alert('The name must be at most 64 characters long');

            return;
        }

        create(name);
    };

    return (
        <Button theme="secondary" width="auto" aria-label="Add controller" onClick={onClick} disabled={isPending}>
            <PlusIcon className="w-4 h-4 text-slate-800" />
        </Button>
    );
};
