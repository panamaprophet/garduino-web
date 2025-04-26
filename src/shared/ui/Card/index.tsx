import { ReactNode } from 'react';

export const Card = (props: { children: ReactNode; className?: string }) => {
    const classList = 'flex flex-col border p-3 grow shadow-xs gap-1 rounded-lg items-center';

    return (
        <div className={`${classList} ${props.className}`}>
            {props.children}
        </div>
    );
};
