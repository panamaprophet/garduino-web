export const Skeleton = () => (
    <div className="animate-pulse h-54 rounded-3xl border border-slate-200 p-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" preserveAspectRatio="none" className="w-full h-full">
            <g>
                <line x1="0" y1="40" x2="300" y2="40" stroke="rgb(241 245 249)" strokeWidth="1" />
                <line x1="0" y1="80" x2="300" y2="80" stroke="rgb(241 245 249)" strokeWidth="1" />
                <line x1="0" y1="120" x2="300" y2="120" stroke="rgb(241 245 249)" strokeWidth="1" />
                <line x1="0" y1="160" x2="300" y2="160" stroke="rgb(241 245 249)" strokeWidth="1" />
            </g>

            <path
                d="M 30 115 L 90 95 L 150 105 L 210 75 L 285 55"
                fill="none"
                stroke="rgb(148 163 184)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    </div>
);
