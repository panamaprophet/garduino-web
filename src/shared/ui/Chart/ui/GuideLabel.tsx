import { ReactNode } from 'react';


const commonClasses = 'absolute text-slate-800/45 whitespace-nowrap text-xs';

const verticalClasses = 'translate-y-1/2 px-0.5 rounded bg-white/80';

const horizontalClasses = '-translate-y-full -translate-x-2/4 first:translate-x-0 last:-translate-x-full only:-translate-x-1/2 px-0.5 rounded bg-white/80';


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
