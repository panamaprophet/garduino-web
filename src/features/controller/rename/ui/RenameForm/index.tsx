import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queries, updateController } from '@/entities/controller';
import { getErrorMessage } from '@/shared/api/client';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Label } from '@/shared/ui/Label';

export const RenameForm = ({ controllerId }: { controllerId: string }) => {
    const queryClient = useQueryClient();
    const { data: controller } = useQuery(queries.get(controllerId));

    const [draft, setDraft] = useState<string | null>(null);

    const { mutate: rename, isPending, error } = useMutation({
        mutationFn: updateController,
        onSuccess: async (renamed) => {
            queryClient.setQueryData(queries.get(controllerId).queryKey, renamed);
            setDraft(null);

            await queryClient.invalidateQueries({ queryKey: queries.list.queryKey });
        },
    });

    const name = draft ?? controller?.name ?? '';
    const trimmed = name.trim();
    const isChanged = draft !== null && trimmed !== controller?.name;
    const isValid = trimmed.length >= 1 && trimmed.length <= 64;

    return (
        <form className="flex flex-col gap-2">
            <Label>
                Name:
                <div className="flex gap-2">
                    <Input value={name} onChange={setDraft} placeholder="Controller name" />
                    <Button
                        type="submit"
                        disabled={!isChanged || !isValid || isPending}
                        onClick={(event) => {
                            event.preventDefault();
                            rename({ controllerId, name: trimmed });
                        }}
                    >
                        Rename
                    </Button>
                </div>
            </Label>

            {error && <p className="text-xs text-red-600">{getErrorMessage(error)}</p>}
        </form>
    );
};
