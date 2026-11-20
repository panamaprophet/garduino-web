import { useQuery } from '@tanstack/react-query';
import { queries, type Controller } from '@/entities/controller';
import { getLastSeen, isOnline, useLatestEvents } from '@/entities/controller-event';
import { formatTimeAgo } from '@/shared/lib/date';
import { Card } from '@/shared/ui/Card';
import { Skeleton } from '../Skeleton';

const cardClassList = `
    items-start cursor-pointer transition-all
    hover:ring-2 hover:ring-emerald-500 hover:ring-offset-2
`;

const ControllerCard = ({ controller, onSelect }: { controller: Controller, onSelect: (controllerId: string) => void }) => {
    const { data: latest } = useLatestEvents(controller.controllerId, { isPolling: true });

    const lastSeen = latest ? getLastSeen(latest) : null;
    const online = latest ? isOnline(latest) : false;

    const status = lastSeen === null
        ? 'No data yet'
        : `${online ? 'Online' : 'Offline'} · seen ${formatTimeAgo(lastSeen)}`;

    return (
        <Card onClick={() => onSelect(controller.controllerId)} className={cardClassList}>
            <span className="flex items-center gap-2 max-w-full">
                <span className={`size-1.5 rounded-full shrink-0 ${online ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <span className="text-slate-800 font-medium text-sm truncate">{controller.name}</span>
            </span>
            <span className="text-slate-400 text-xs">{latest ? status : '…'}</span>
        </Card>
    );
};

export const ControllerList = ({ onSelect }: { onSelect: (controllerId: string) => void }) => {
    const { data: controllers = [], isLoading } = useQuery(queries.list);

    if (isLoading) {
        return <Skeleton />;
    }

    if (controllers.length === 0) {
        return (
            <p className="text-slate-400 text-center py-8">
                No controllers yet
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {controllers.map((controller) => (
                <ControllerCard key={controller.controllerId} controller={controller} onSelect={onSelect} />
            ))}
        </div>
    );
};
