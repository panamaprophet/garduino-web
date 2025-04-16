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
        <div className="aspect-square">
        <Button theme="secondary" onClick={onCreateController}>
            <PlusIcon className="w-4 h-4 m-0.5 text-black"/>
        </Button>
        </div>
    );
}
