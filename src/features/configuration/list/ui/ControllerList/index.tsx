import { useQuery } from '@tanstack/react-query';
import { queries } from '@/entities/controller-configuration';
import { Loader } from '@/shared/ui/Loader';
import { Leaf } from '@/shared/ui/Icon';

const truncateId = (id: string) => id.slice(0, 8);

const cardClassList = [
    'flex items-center gap-3 border rounded-lg shadow-xs p-3',
    'cursor-pointer transition-all',
    'hover:ring-2 hover:ring-emerald-500 hover:ring-offset-2',
].join(' ');

export const ControllerList = ({ onSelect }: { onSelect: (controllerId: string) => void }) => {
    const { data: controllerIds = [], isLoading } = useQuery(queries.listConfigurations);

    if (isLoading) {
        return <Loader status="Loading controllers" />;
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
                <div key={id} className={cardClassList} onClick={() => onSelect(id)}>
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-emerald-50 shrink-0">
                        <Leaf className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-slate-800 font-medium text-sm truncate">{truncateId(id)}</span>
                        <span className="text-slate-400 text-xs">Controller</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
