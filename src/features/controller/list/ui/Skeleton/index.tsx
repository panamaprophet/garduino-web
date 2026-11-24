export const Skeleton = () => (
    <div className="animate-pulse flex flex-col gap-2">
        <div className="flex flex-col gap-2.5 border rounded-lg p-3">
            <div className="h-4.5 rounded bg-slate-200 w-24" />
            <div className="h-3 rounded bg-slate-200 w-20" />
        </div>

        <div className="flex flex-col gap-2.5 border rounded-lg p-3">
            <div className="h-4.5 rounded bg-slate-200 w-24" />
            <div className="h-3 rounded bg-slate-200 w-20" />
        </div>

        <div className="flex flex-col gap-2.5 border rounded-lg p-3">
            <div className="h-4.5 rounded bg-slate-200 w-24" />
            <div className="h-3 rounded bg-slate-200 w-20" />
        </div>
    </div>
);
