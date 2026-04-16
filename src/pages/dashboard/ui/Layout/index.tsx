import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export const Layout = ({ children }: Props) => (
    <div className="p-4 max-w-sm mx-auto text-sm">
        <div className="flex flex-col gap-4">
            {children}
        </div>
    </div>
);
