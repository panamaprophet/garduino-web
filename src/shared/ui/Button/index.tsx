import { MouseEventHandler, ReactNode } from 'react';

const buttonClassList = 'transition-all cursor-pointer border-none rounded-lg p-2.5 text-sm font-medium';

const ButtonWidth = {
    full: 'w-full',
    auto: 'w-auto',
};

const ButtonTheme = {
    primary: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800',
};

interface Props { 
    children: ReactNode;
    width?: 'full' | 'auto';
    disabled?: boolean;
    type?: 'button' | 'submit';
    theme?: keyof typeof ButtonTheme;
    onClick: MouseEventHandler<HTMLButtonElement>;
}

export const Button = ({ children, onClick, disabled, width = 'auto', type = 'button', theme = 'primary' }: Props) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${buttonClassList} ${ButtonWidth[width]} ${ButtonTheme[theme]}`}
    >
        {children}
    </button>
);
