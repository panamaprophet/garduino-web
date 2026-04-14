import { useState } from 'react';

import { Tabs } from '@/shared/ui/Tabs';
import { withAuth } from '@/shared/auth';
import { Button } from '@/shared/ui/Button';
import { ChevronLeft } from '@/shared/ui/Icon';

import { ControllerStatus } from '@/features/status';
import { FirmwareUpdatePanel } from '@/features/firmware';
import { ControllerList } from '@/features/configuration/list';
import { ControllerEditForm } from '@/features/configuration/edit';
import { ControllerAddButton } from '@/features/configuration/add';
import { ControllerHistoricalData } from '@/features/historical-data';
import { ControllerRebootButton } from '@/features/configuration/reboot';

import { Tab } from './model/tab';
import { Layout } from './ui/Layout';
import { useLocationHash } from './lib/useLocationHash';

const tabs = {
    logs: [ControllerHistoricalData],
    configuration: [ControllerEditForm, ControllerRebootButton],
    firmware: [FirmwareUpdatePanel],
};

export const Dashboard = withAuth(() => {
    const [controllerId, setLocationHash] = useLocationHash();
    const [tab, setTab] = useState<Tab>(Tab.Logs);

    const Components = tab ? tabs[tab] : [];

    const onBack = () => setLocationHash('');

    if (!controllerId) {
        return (
            <Layout>
                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-semibold text-slate-800">Controllers</h1>
                    <ControllerAddButton />
                </div>

                <ControllerList onSelect={setLocationHash} />
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="flex items-center gap-3">
                <Button
                    onClick={onBack}
                    aria-label="Back to controllers"
                    theme="secondary"
                    width="auto"
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>

                <span className="text-slate-800 font-medium truncate">
                    <span className="text-slate-400">ID:</span> {controllerId}
                </span>
            </div>

            <hr className="border-slate-200 my-4" />

            <ControllerStatus controllerId={controllerId} key={controllerId} />

            <hr className="border-slate-200 my-4" />

            <Tabs tabs={[...Object.values(Tab)]} currentTab={tab} onClick={setTab} />

            {Components.map((Component, index) => (
                <Component key={index} controllerId={controllerId} />
            ))}
        </Layout>
    );
});
