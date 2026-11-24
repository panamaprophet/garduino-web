import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queries, removeController } from '@/entities/controller';
import { getErrorMessage } from '@/shared/api/client';
import { Button } from '@/shared/ui/Button';

export const RemoveButton = ({ controllerId, onRemoved }: { controllerId: string, onRemoved: () => void }) => {
    const queryClient = useQueryClient();
    const { data: controller } = useQuery(queries.get(controllerId));

    const { mutate: remove, isPending } = useMutation({
        mutationFn: removeController,
        onSuccess: async () => {
            queryClient.removeQueries({ queryKey: queries.get(controllerId).queryKey });

            await queryClient.invalidateQueries({ queryKey: queries.list.queryKey });

            onRemoved();
        },
        onError: (error) => alert(`Failed to delete the controller: ${getErrorMessage(error)}`),
    });

    const onClick = () => {
        if (!controller) {
            return;
        }

        const answer = prompt(
            `This revokes the device certificates and disconnects the controller immediately. `
            + `Its settings and history become unreachable.\n\nType "${controller.name}" to delete it:`,
        );

        if (answer?.trim() !== controller.name) {
            return;
        }

        remove(controllerId);
    };

    return (
        <Button width="full" theme="danger" onClick={onClick} disabled={!controller || isPending}>
            Delete controller
        </Button>
    );
};
