export const Loader = ({ status }: { status: string }) => (
    <p className="flex flex-grow items-center justify-center gap-2">
        <span className="inline-block animate-spin">✿</span> {status}
    </p>
);
