interface Props<T> {
    tabs: T[];
    currentTab: T;
    onClick: (tab: T) => void;
}

const wrapperClassList = 'flex justify-between p-0.5 gap-1 bg-slate-100 rounded-lg';
const tabClassList = 'capitalize px-2.5 py-1.5 rounded grow w-1/2 flex justify-center cursor-pointer';
const outline = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500';
const activeTabClassList = 'bg-white shadow-sm';
const inactiveTabClassList = 'text-slate-400';

export const Tabs = <T extends string | number>({ currentTab, tabs, onClick }: Props<T>) => {
    return (
        <div role="tablist" className={wrapperClassList}>
            {tabs.map((tab) => (
                <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={tab === currentTab}
                    className={`${tab === currentTab ? activeTabClassList : inactiveTabClassList} ${tabClassList} ${outline}`}
                    onClick={() => onClick(tab)}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};
