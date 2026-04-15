import { MouseEventHandler, ReactNode } from 'react';

const defaultClassList = 'flex flex-col border p-3 grow shadow-xs gap-1 rounded-lg items-center transition-all';

interface Props {
    children: ReactNode;
    className?: string;
    onClick?: MouseEventHandler;
}

export const Card = ({ children, className, onClick }: Props) => {
    const classList = `
        ${defaultClassList}
        ${onClick ? 'cursor-pointer' : ''}
        ${className ?? ''}
    `;

    return (
        <div className={classList} onClick={onClick}>
            {children}
        </div>
    );
};