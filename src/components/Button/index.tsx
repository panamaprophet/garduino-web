import { ReactNode } from 'react';

const buttonClassList = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded';

export const Button = ({ children, onClick, disabled }: { onClick: () => void, disabled?: boolean, children: ReactNode }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={buttonClassList}
    >
        {children}
    </button>
);
