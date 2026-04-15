import { useQuery } from '@tanstack/react-query';
import { queries } from '@/entities/controller-configuration';
import { Skeleton } from '../Skeleton';
import { Card } from '@/shared/ui/Card';

const truncateId = (id: string) => id.slice(0, 8);

const cardClassList = `
    items-start cursor-pointer transition-all
    hover:ring-2 hover:ring-emerald-500 hover:ring-offset-2
`;

export const ControllerList = ({ onSelect }: { onSelect: (controllerId: string) => void }) => {
    const { data: controllerIds = [], isLoading } = useQuery(queries.listConfigurations);

    if (isLoading) {
        return <Skeleton />;
    }

    if (controllerIds.length === 0) {
        return (
            <p className="text-slate-400 text-center py-8">
                No controllers yet
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {controllerIds.map((id) => (
                <Card key={id} onClick={() => onSelect(id)} className={cardClassList}>
                    <span className="text-slate-800 font-medium text-sm truncate">{truncateId(id)}</span>
                    <span className="text-slate-400 text-xs">Controller</span>
                </Card>
            ))}
        </div>
    );
};
