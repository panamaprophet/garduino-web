import { MouseEventHandler, ReactNode } from 'react';

const buttonClassList = 'transition-all cursor-pointer text-gray-900 border-gray-300 hover:bg-gray-300/25 border rounded-lg py-2 px-5 text-sm';

interface Props { 
    children: ReactNode;
    disabled?: boolean;
    type?: 'button' | 'submit';
    onClick: MouseEventHandler<HTMLButtonElement>;
}

export const Button = ({ children, onClick, disabled, type = 'button' }: Props) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={buttonClassList}
    >
        {children}
    </button>
);
