import { MouseEventHandler, ReactNode } from 'react';

const outlineClassList = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500';
const disabledClassList = 'disabled:opacity-50 disabled:cursor-not-allowed';
const buttonClassList = `transition-all cursor-pointer border-none rounded-lg p-2.5 text-sm font-medium ${outlineClassList} ${disabledClassList}`;

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
    'aria-label'?: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
}

export const Button = ({ children, onClick, disabled, width = 'auto', type = 'button', theme = 'primary', 'aria-label': ariaLabel }: Props) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        className={`${buttonClassList} ${ButtonWidth[width]} ${ButtonTheme[theme]}`}
    >
        {children}
    </button>
);
