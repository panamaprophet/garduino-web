import { withAuth } from '@/shared/auth';

import { ControllerStatus } from '@/features/controller-status';

import { ControllerList } from '@/features/controller-configuration/list';
import { ControllerEditForm } from '@/features/controller-configuration/edit';
import { ControllerAddButton } from '@/features/controller-configuration/add';
import { ControllerRebootButton } from '@/features/controller-configuration/reboot';

import { useLocationHash } from './lib/useLocationHash';
// import { ControllerHistoricalData } from '@/features/controller-historical-data';

export const Dashboard = withAuth(() => {
    const [controllerId, setLocationHash] = useLocationHash();

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
                        {/* <ControllerHistoricalData controllerId={controllerId} /> */}
                        <ControllerEditForm controllerId={controllerId} />
                        <ControllerRebootButton controllerId={controllerId} />
                    </>
                )}
            </div>
        </div>
    );
});
