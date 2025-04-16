import { Button } from "@/shared/ui/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConfiguration } from "@/entities/configuration";
import { PlusIcon } from "lucide-react";

// @todo: return config with certs and so on in cb on create
export const AddButton = () => {
    const { mutateAsync: create } = useMutation({ mutationFn: createConfiguration });
    const queryClient = useQueryClient();

    const onCreateController = async () => {
        await create();
        await queryClient.invalidateQueries({ queryKey: ['controllers', 'list'] });
    };

    return (
        <Button theme="neutral" onClick={onCreateController}>
            <PlusIcon className="w-4 h-4 text-black"/>
        </Button>
    );
}
