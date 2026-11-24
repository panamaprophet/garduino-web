export const Skeleton = () => (
    <div className="animate-pulse flex flex-col gap-4 items-center">
        <div className="size-[338px] bg-slate-200 rounded-full border border-slate-200 my-9.5" />

        <div className="flex gap-4 w-full">
            <div className="h-16 rounded-lg bg-slate-200 w-1/2" />
            <div className="h-16 rounded-lg bg-slate-200 w-1/2" />
        </div>

        <div className="flex flex-col gap-4 w-full">
            <div className="h-14 rounded-lg bg-slate-200" />
            <div className="h-14 rounded-lg bg-slate-200" />
        </div>

        <div className="h-10 w-full rounded-lg bg-slate-200" />
    </div>
);
