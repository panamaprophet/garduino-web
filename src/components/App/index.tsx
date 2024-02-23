import { useEffect, useMemo, useState } from 'react';

import { ConfigurationForm } from '@/components/ConfigurationForm';
import { StatePanel } from '@/components/StatePanel';
import { Button } from '@/components/Button';
import { Arrows } from '@/components/Icon';
import { Dropdown } from '@/components/Dropdown';
import { Loader } from '@/components/Loader';

import { usePubSubClient } from '@/hooks/usePubSubClient';
import { useLocationHash } from '@/hooks/useLocationHash';
import { useControllerList } from '@/hooks/useControllerList';
import { useControllerConfiguration } from '@/hooks/useControllerConfiguration';

import { ControllerId, ControllerState } from '@/types';
import { withAuth } from '@/hooks/useAuth';

export const App = withAuth(() => {
    const [locationHash, setLocationHash] = useLocationHash();

    const controllerIds = useControllerList();

    const controllerId = locationHash as ControllerId;

    const [configuration, setConfiguration, saveConfiguration] = useControllerConfiguration(controllerId);
    const [state, setState] = useState<ControllerState>();

    const rebootController = () => publish(`controllers/${controllerId}/reboot/sub`);
    const updateState = () => publish(`controllers/${controllerId}/status/sub`);

    const topics = useMemo(() => {
        if (!controllerId) {
            return {};
        }

        return {
            [`controllers/${controllerId}/status/pub`]: (data: ControllerState) => {
                setState(state => ({ ...state, ...data }));
            },
            [`controllers/${controllerId}/events/pub`]: (data: Pick<ControllerState, 'temperature' | 'humidity'>) => {
                setState(state => ({ ...state!, ...data }));
            },
        };
    }, [controllerId]);

    const [isConnected, publish] = usePubSubClient(topics);

    useEffect(() => {
        if (isConnected) {
            updateState();
        }
    }, [isConnected]);

    return (
        <div className="p-4 max-w-md mx-auto text-sm">
            <Dropdown
                title="Select controller"
                value={controllerId}
                options={controllerIds}
                onChange={setLocationHash}
            />

            <div className="border-b border-b-gray-200">
                {state && <StatePanel state={state} />}

                {!state && <Loader status="Loading" />}
            </div>

            {configuration && (
                <>
                    <ConfigurationForm state={configuration} onChange={setConfiguration} />

                    <hr className="my-2.5" />

                    <div className="flex gap-2 justify-between pt-4">
                        <Button onClick={rebootController} disabled={!isConnected}>
                            Reboot
                        </Button>

                        <div className="flex gap-2">
                            <Button onClick={updateState} disabled={!isConnected}>
                                <Arrows />
                            </Button>

                            <Button onClick={saveConfiguration}>
                                Save
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
});
