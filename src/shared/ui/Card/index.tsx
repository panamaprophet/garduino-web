import { MouseEventHandler, ReactNode } from 'react';

const classList = 'flex flex-col border p-3 grow shadow-xs gap-1 rounded-lg items-center cursor-pointer transition-all';

interface Props {
    children: ReactNode;
    className?: string;
    onClick?: MouseEventHandler;
}

export const Card = (props: Props) => (
    <div className={`${classList} ${props.className}`} onClick={props.onClick}>
        {props.children}
    </div>
);
