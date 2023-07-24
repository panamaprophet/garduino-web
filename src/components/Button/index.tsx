import { ReactNode } from 'react';

const buttonClassList = 'transition-all cursor-pointer text-gray-900 border-gray-300 hover:bg-gray-300/25 border rounded-lg py-2 px-5 text-sm';

export const Button = ({ children, onClick, disabled }: { onClick: () => void, disabled?: boolean, children: ReactNode }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={buttonClassList}
    >
        {children}
    </button>
);
