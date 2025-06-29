import { useState } from 'react';
import { withAuth } from '@/shared/auth';
import { Tabs } from '@/shared/ui/Tabs';

import { ControllerStatus } from '@/features/status';

import { ControllerList } from '@/features/configuration/list';
import { ControllerEditForm } from '@/features/configuration/edit';
import { ControllerAddButton } from '@/features/configuration/add';
import { ControllerRebootButton } from '@/features/configuration/reboot';
import { ControllerHistoricalData } from '@/features/historical-data';

import { useLocationHash } from './lib/useLocationHash';

export const Dashboard = withAuth(() => {
    const [controllerId, setLocationHash] = useLocationHash();

    const tabs = ['logs', 'configuration'];
    const [tab, setTab] = useState('logs');

    return (
        <div className="p-4 max-w-md mx-auto text-sm">
            <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <ControllerList selectedId={controllerId} onSelect={setLocationHash} />
                    <ControllerAddButton />
                </div>

                {controllerId && (
                    <>
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
                    </>
                )}
            </div>
        </div>
    );
});
