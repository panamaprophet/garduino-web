import { MouseEventHandler, ReactNode } from 'react';

const buttonClassList = 'transition-all cursor-pointer text-slate-900 border-slate-300 border rounded-lg py-2 px-3 text-sm';

const ButtonWidth = {
    full: 'w-full',
    auto: 'w-auto',
};

const ButtonTheme = {
    default: 'bg-emerald-500 hover:bg-emerald-600 text-white border-none',
    warning: 'bg-red-500 hover:bg-red-600 text-white border-none',
    neutral: 'bg-slate-100 hover:bg-slate-200 border-none',

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
