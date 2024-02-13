import { useEffect, useState } from 'react';

import { ConfigurationForm } from '../ConfigurationForm';
import { StatePanel } from '../StatePanel';
import { Button } from '../Button';
import { Arrows } from '../Icon';
import { Dropdown } from '../Dropdown';
import { Loader } from '../Loader';

import { usePubSubClient } from '../../hooks/usePubSubClient';
import { useLocationHash } from '../../hooks/useLocationHash';
import { useControllerList } from '../../hooks/useControllerList';
import { useControllerConfiguration } from '../../hooks/useControllerConfiguration';

import { ControllerId, ControllerState } from '../../types';

export const App = () => {
    const controllerIds = useControllerList();

    const [locationHash, setLocationHash] = useLocationHash();
    const [controllerId, setControllerId] = useState<ControllerId>(locationHash as ControllerId);
    const [configuration, setConfiguration, saveConfiguration] = useControllerConfiguration(controllerId);
    const [state, setState] = useState<ControllerState>();

    const rebootController = () => publish(`controllers/${controllerId}/reboot/sub`);
    const updateState = () => publish(`controllers/${controllerId}/status/sub`);

    const onStatusMessage = (data: ControllerState) => setState({ ...state, ...data });
    const onUpdateMessage = (data: Pick<ControllerState, 'temperature' | 'humidity'>) => setState({ ...state!, ...data });

    const [isConnected, publish] = usePubSubClient(controllerId ? {
        [`controllers/${controllerId}/status/pub`]: onStatusMessage,
        [`controllers/${controllerId}/events/pub`]: onUpdateMessage,
    } : {});

    useEffect(() => {
        if (isConnected && controllerId) {
            updateState();
        }
    }, [isConnected, controllerId]);

    useEffect(() => {
        if (locationHash && locationHash !== controllerId) {
            setControllerId(locationHash as ControllerId);
        }

        if (controllerId && !locationHash) {
            setLocationHash(controllerId);
        }
    }, [locationHash, controllerId]);

    return (
        <div className="p-4 max-w-md mx-auto text-sm">
            <Dropdown
                title="Select controller"
                value={controllerId}
                options={controllerIds}
                onChange={setControllerId}
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
};
