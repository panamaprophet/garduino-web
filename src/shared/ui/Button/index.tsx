import { MouseEventHandler, ReactNode } from 'react';

const buttonClassList = 'transition-all cursor-pointer text-gray-900 border-gray-300 hover:bg-gray-300/25 border rounded-lg py-2 px-3 text-sm';

const ButtonWidth = {
    full: 'w-full',
    auto: 'w-auto',
};

const ButtonTheme = {
    default: 'bg-emerald-500 hover:bg-emerald-600 text-white border-none',
    warning: 'bg-red-500 hover:bg-red-600 text-white border-none',
    neutral: 'bg-none hover:bg-slate-100 border-none',

}

interface Props { 
    children: ReactNode;
    width?: 'full' | 'auto';
    disabled?: boolean;
    type?: 'button' | 'submit';
    theme?: keyof typeof ButtonTheme;
    onClick: MouseEventHandler<HTMLButtonElement>;
}

export const Button = ({ children, onClick, disabled, width = 'auto', type = 'button', theme = 'default' }: Props) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${buttonClassList} ${ButtonWidth[width]} ${ButtonTheme[theme]}`}
    >
        {children}
    </button>
);
