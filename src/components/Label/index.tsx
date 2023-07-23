import { ReactNode } from 'react';

export const Label = ({ children, className = '' }: { children: ReactNode, className?: string }) => (
    <label className={`flex flex-col gap-2 mb-4 ${className}`}>
        {children}
    </label>
);
