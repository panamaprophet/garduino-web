interface Props<T> {
    tabs: T[];
    currentTab: T;
    onClick: (tab: T) => void;
}

const wrapperClassList = 'flex justify-between p-0.5 gap-1 bg-slate-100 rounded shadow-xs';
const tabClassList = 'capitalize p-2 rounded grow w-1/2 flex justify-center cursor-pointer';
const activeTabClassList = 'bg-white shadow-xs';
const inactiveTabClassList = 'text-slate-400';

export const Tabs = <T extends string | number>({ currentTab, tabs, onClick }: Props<T>) => {
    return (
        <div className={wrapperClassList}>
            {tabs.map((tab) => (
                <div
                    key={tab}
                    className={`${tab === currentTab ? activeTabClassList : inactiveTabClassList} ${tabClassList}`}
                    onClick={() => onClick(tab)}
                >
                    {tab}
                </div>
            ))}
        </div>
    );
};
