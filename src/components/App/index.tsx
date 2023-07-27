import { useEffect, useState } from 'react';

import { ConfigurationForm } from '../ConfigurationForm';
import { StatePanel } from '../StatePanel';
import { Button } from '../Button';
import { Arrows } from '../Icon';
import { Dropdown } from '../Dropdown';
import { Loader } from '../Loader';

import { usePubSubClient } from '../../hooks/usePubSubClient';
import { useControllerList } from '../../hooks/useControllerList';
import { useControllerConfiguration } from '../../hooks/useControllerConfiguration';

import { ControllerId, ControllerState } from '../../types';


export const App = () => {
    const controllerIds = useControllerList();

    const [controllerId, setControllerId] = useState<ControllerId>();
    const [configuration, setConfiguration, saveConfiguration] = useControllerConfiguration(controllerId);
    const [state, setState] = useState<ControllerState>();

    const rebootController = () => publish(`controllers/${controllerId}/reboot/sub`);
    const updateState = () => publish(`controllers/${controllerId}/status/sub`);

    const [isConnected, publish] = usePubSubClient(controllerId ? {
        [`controllers/${controllerId}/status/pub`]: setState,
        [`controllers/${controllerId}/events/pub`]: (data: { temperature: number, humidity: number }) => setState(Object.assign({}, state, data)),
    } : {});

    useEffect(() => {
        if (isConnected && controllerId) {
            publish(`controllers/${controllerId}/status/sub`);
        }
    }, [isConnected]);

    return (
        <div className="p-4 max-w-md mx-auto text-sm">
            <Dropdown
                title="Select controller"
                items={controllerIds}
                selectedItem={controllerId}
                onChange={setControllerId}
            />

            {controllerId && !(state && configuration) && (
                <Loader status="Loading" />
            )}

            {controllerId && configuration && state && (
                <>
                    <StatePanel state={state} />

                    <hr />

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
