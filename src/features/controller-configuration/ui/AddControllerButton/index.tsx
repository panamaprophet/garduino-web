import { Button } from "@/shared/ui/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConfiguration } from "@/entities/configuration";

// @todo: return config with certs and so on in cb on create
export const AddControllerButton = () => {
    const { mutateAsync: create } = useMutation({ mutationFn: createConfiguration });
    const queryClient = useQueryClient();

    const onCreateController = async () => {
        await create();
        await queryClient.invalidateQueries({ queryKey: ['controllers', 'list'] });
    };

    return (
        <Button onClick={onCreateController}>+</Button>
    );
}
