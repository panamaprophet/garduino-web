import { useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Tabs } from '@/shared/ui/Tabs';
import { withAuth } from '@/shared/auth';
import { Button } from '@/shared/ui/Button';
import { Divider } from '@/shared/ui/Divider';
import { ChevronLeft } from '@/shared/ui/Icon';

import { queries } from '@/entities/controller';

import { ControllerStatus } from '@/features/status';
import { FirmwareUpdatePanel } from '@/features/firmware';
import { ControllerList } from '@/features/controller/list';
import { ControllerAddButton } from '@/features/controller/add';
import { ControllerSettingsForm } from '@/features/settings/edit';
import { ControllerTelemetry } from '@/features/telemetry';

import { Tab } from './model/tab';
import { Layout } from './ui/Layout';
import { DeviceTab } from './ui/DeviceTab';
import { useLocationHash } from './lib/useLocationHash';

export const Dashboard = withAuth(() => {
    const [controllerId, setLocationHash] = useLocationHash();
    const [tab, setTab] = useState<Tab>(Tab.Logs);

    const { data: controller, isError } = useQuery({ ...queries.get(controllerId), enabled: Boolean(controllerId) });

    const onBack = () => setLocationHash('');

    if (!controllerId) {
        return (
            <Layout>
                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-semibold text-slate-800">Controllers</h1>
                    <ControllerAddButton onCreated={setLocationHash} />
                </div>

                <Divider />

                <ControllerList onSelect={setLocationHash} />
            </Layout>
        );
    }

    const header = (
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
                {controller?.name ?? <span className="text-slate-400">{controllerId}</span>}
            </span>
        </div>
    );

    if (isError) {
        return (
            <Layout>
                {header}

                <Divider />

                <p className="text-slate-400 text-center py-8">
                    Controller not found
                </p>
            </Layout>
        );
    }

    const tabs: Record<Tab, ReactNode> = {
        [Tab.Logs]: <ControllerTelemetry controllerId={controllerId} />,
        [Tab.Settings]: <ControllerSettingsForm controllerId={controllerId} />,
        [Tab.Firmware]: <FirmwareUpdatePanel controllerId={controllerId} />,
        [Tab.Device]: <DeviceTab controllerId={controllerId} onRemoved={onBack} />,
    };

    return (
        <Layout>
            {header}

            <Divider />

            <ControllerStatus controllerId={controllerId} key={controllerId} />

            <Divider />

            <Tabs tabs={[...Object.values(Tab)]} currentTab={tab} onClick={setTab} />

            {tabs[tab]}
        </Layout>
    );
});
