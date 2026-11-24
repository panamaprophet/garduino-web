interface Props {
    items: Array<{ label: string, color: string }>;
    currentItems: Array<string>;
    onChange: (item: string) => void;
}

const buttonClassList = `
    flex items-center gap-1.5 px-3 py-1.5
    border rounded-lg font-normal text-sm transition-all
`;

const buttonActiveClassList = `
    border border-slate-200 text-slate-800 hover:border-slate-400
`;

const buttonInactiveClassList = `
    border-slate-200 text-slate-400 grayscale
`;

export const LabelGroup = ({ items, currentItems, onChange }: Props) => {
    return (
        <div className="flex gap-2 flex-wrap">
            {items.map((item) => {
                const isActive = currentItems.includes(item.label);
                const isDisabled = isActive && currentItems.length === 1;

                const classList = `
                    ${buttonClassList}
                    ${isActive ? buttonActiveClassList : buttonInactiveClassList}
                    ${isDisabled ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
                `;

                return (
                    <button
                        key={item.label}
                        onClick={() => onChange(item.label)}
                        disabled={isDisabled}
                        className={classList}
                    >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />

                        {item.label}
                    </button>
                );
            })}
        </div>
    );
};