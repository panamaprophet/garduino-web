import { useState } from 'react';
import { withAuth } from '@/shared/auth';
import { Tabs } from '@/shared/ui/Tabs';

import { ControllerStatus } from '@/features/status';

import { ControllerList } from '@/features/configuration/list';
import { ControllerEditForm } from '@/features/configuration/edit';
import { ControllerAddButton } from '@/features/configuration/add';
import { ControllerRebootButton } from '@/features/configuration/reboot';
import { ControllerHistoricalData } from '@/features/historical-data';
import { FirmwareUpdatePanel } from '@/features/firmware';
import { ChevronLeft } from '@/shared/ui/Icon';

import { useLocationHash } from './lib/useLocationHash';

export const Dashboard = withAuth(() => {
    const [controllerId, setLocationHash] = useLocationHash();

    const tabs = ['logs', 'configuration', 'firmware'];
    const [tab, setTab] = useState('logs');

    const goBack = () => setLocationHash('');

    if (!controllerId) {
        return (
            <div className="p-4 max-w-md mx-auto text-sm">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-lg font-semibold text-slate-800">Controllers</h1>
                        <ControllerAddButton />
                    </div>
                    <ControllerList onSelect={setLocationHash} />
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-md mx-auto text-sm">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 border rounded-lg shadow-xs p-2.5">
                    <button
                        onClick={goBack}
                        aria-label="Back to controllers"
                        className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 hover:bg-emerald-500 hover:text-white text-slate-500 transition-all cursor-pointer shrink-0"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="h-5 w-px bg-slate-200" />

                    <span className="text-slate-800 font-medium truncate">
                        <span className="text-slate-400">ID:</span> {controllerId}
                    </span>
                </div>

                <ControllerStatus controllerId={controllerId} />

                <Tabs tabs={tabs} currentTab={tab} onClick={setTab} />

                {tab === 'logs' && (
                    <div className="mt-5">
                        <ControllerHistoricalData controllerId={controllerId} />
                    </div>
                )}

                {tab === 'configuration' && (
                    <>
                        <ControllerEditForm controllerId={controllerId} />
                        <ControllerRebootButton controllerId={controllerId} />
                    </>
                )}

                {tab === 'firmware' && (
                    <FirmwareUpdatePanel controllerId={controllerId} />
                )}
            </div>
        </div>
    );
});
