export const Loader = ({ status }: { status: string }) => (
    <p className="p-4 flex items-center justify-center gap-2">
        <span className="inline-block animate-spin">✿</span> {status}
    </p>
);
