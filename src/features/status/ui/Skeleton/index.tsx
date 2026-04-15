import { Card } from '@/shared/ui/Card';

export const Skeleton = () => (
    <div className="animate-pulse grid auto-cols-fr grid-flow-col gap-2 pt-0.5">
        <Card>
            <div className="w-7 h-7 rounded-full border border-slate-200" />
            <div className="h-4 rounded bg-slate-200 w-12" />
        </Card>

        <Card>
            <div className="w-7 h-7 rounded-full border border-slate-200" />
            <div className="h-4 rounded bg-slate-200 w-12" />
        </Card>

        <Card>
            <div className="w-7 h-7 rounded-full border border-slate-200" />
            <div className="h-4 rounded bg-slate-200 w-12" />
        </Card>

        <Card>
            <div className="w-7 h-7 rounded-full border border-slate-200" />
            <div className="h-4 rounded bg-slate-200 w-12" />
        </Card>
    </div>
);
