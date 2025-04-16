import { ReactNode } from 'react';

export const Label = ({ children, className = '' }: { children: ReactNode, className?: string }) => (
    <label className={`flex flex-col gap-2 font-medium ${className}`}>
        {children}
    </label>
);
