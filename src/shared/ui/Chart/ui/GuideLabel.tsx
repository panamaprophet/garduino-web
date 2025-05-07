import { ReactNode } from 'react';


const commonClasses = 'absolute text-[#191926]/44 whitespace-nowrap';

const verticalClasses = 'w-7 text-xs text-left translate-y-1/2';

const horizontalClasses = 'text-xs -translate-x-2/4 first:translate-x-0 last:-translate-x-full only:-translate-x-1/2';


export const YLabel = ({ position, children }: { position: number; children: ReactNode }) => (
    <span
        className={`${commonClasses} ${verticalClasses}`}
        style={{ bottom: `${position}%` }}
    >
        {children}
    </span>
);

export const XLabel = ({ position, children }: { position: number; children: ReactNode }) => (
    <span
        className={`${commonClasses} ${horizontalClasses}`}
        style={{ left: `${position}%` }}
    >
        {children}
    </span>
);
