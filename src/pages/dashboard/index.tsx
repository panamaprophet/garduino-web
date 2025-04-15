import { ControllerList, EditControllerConfigurationForm, AddControllerButton, RebootControllerButton } from '@/features/controller-configuration';
import { ControllerStatusPanel } from '@/features/controller-status';
import { withAuth } from '@/shared/auth';

import { useLocationHash } from './lib/useLocationHash';

export const Dashboard = withAuth(() => {
    const [controllerId, setLocationHash] = useLocationHash();

    return (
        <div className="p-4 max-w-md mx-auto text-sm">
            <div className="flex gap-2">
                <ControllerList selectedId={controllerId} onSelect={setLocationHash} />

                <AddControllerButton />
            </div>

            {controllerId && (
                <div className="flex flex-col gap-4">
                    <ControllerStatusPanel controllerId={controllerId} />

                    {/* <hr /> */}

                    <EditControllerConfigurationForm controllerId={controllerId} />

                    {/* <hr className="my-2.5" /> */}

                    {/* <div className="flex gap-2 justify-between pt-4"> */}
                        <RebootControllerButton controllerId={controllerId} />
                    {/* </div> */}
                </div>
            )}
        </div>
    );
});
