

import { ControllerList, ControllerConfigurationForm, AddControllerButton, RebootButton } from '@/features/controller-configuration';
import { ControllerStatePanel, GetStateButton } from '@/features/controller-state';
import { withAuth } from '@/features/auth';

import { useLocationHash } from './lib/useLocationHash';

export const App = withAuth(() => {
    const [controllerId, setLocationHash] = useLocationHash();

    return (
        <div className="p-4 max-w-md mx-auto text-sm">
            <div className="flex gap-2">
                <ControllerList selectedId={controllerId} onSelect={setLocationHash} />

                <AddControllerButton />
            </div>

            {controllerId && (
                <>
                    <ControllerStatePanel controllerId={controllerId} />

                    <hr />

                    <ControllerConfigurationForm controllerId={controllerId} />

                    <hr className="my-2.5" />

                    <div className="flex gap-2 justify-between pt-4">
                        <RebootButton controllerId={controllerId} />

                        <GetStateButton controllerId={controllerId} />
                    </div>
                </>
            )}
        </div>
    );
});
