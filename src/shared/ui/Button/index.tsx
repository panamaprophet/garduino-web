import { MouseEventHandler, ReactNode } from 'react';

const buttonClassList = 'transition-all cursor-pointer text-gray-900 border-gray-300 hover:bg-gray-300/25 border rounded-lg py-2 px-5 text-sm';

const ButtonWidth = {
    full: 'w-full',
    auto: 'w-auto',
};

interface Props { 
    children: ReactNode;
    width?: 'full' | 'auto';
    disabled?: boolean;
    type?: 'button' | 'submit';
    onClick: MouseEventHandler<HTMLButtonElement>;
}

export const Button = ({ children, onClick, disabled, width = 'auto', type = 'button' }: Props) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${buttonClassList} ${ButtonWidth[width]}`}
    >
        {children}
    </button>
);
