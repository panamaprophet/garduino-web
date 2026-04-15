import { Card } from '@/shared/ui/Card';

export const Skeleton = () => (
    <div className="animate-pulse flex flex-col gap-2">
        <Card>
            <div className="h-4.5 rounded bg-slate-200 w-full self-start" />
            <div className="h-4.5 rounded bg-slate-200 w-1/2 self-start" />
        </Card>

        <Card>
            <div className="h-4.5 rounded bg-slate-200 w-full self-start" />
            <div className="h-4.5 rounded bg-slate-200 w-1/2 self-start" />
        </Card>

        <Card>
            <div className="h-4.5 rounded bg-slate-200 w-full self-start" />
            <div className="h-4.5 rounded bg-slate-200 w-1/2 self-start" />
        </Card>

        <div className="h-10 w-full rounded-lg bg-slate-200" />
    </div>
);
