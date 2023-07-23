import { useEffect, useState } from 'react';
import { usePubSubClient } from '../../hooks/usePubSubClient';
import { getControllerConfiguration, saveControllerConfiguration } from '../../resolvers';
import { ControllerConfigurationForm } from '../ControllerConfigurationForm';
import { ControllerState } from '../ControllerState';
import { Input } from '../Input';
import { Button } from '../Button';
import * as Types from '../../types';


export const App = () => {
    const [controllerState, setControllerState] = useState<Types.ControllerState>();
    const [controllerConfiguration, setControllerConfiguration] = useState<any>();

    const controllerId = 'a36805cc-35de-4c50-99de-936719924199';


    const onStatusMessage = (message: Types.ControllerState) => setControllerState(message);

    const onEventMessage = ({ temperature, humidity }: Pick<Types.ControllerState, 'humidity' | 'temperature'>) => setControllerState({ ...(controllerState || {} as Types.ControllerState), temperature, humidity });

    const rebootController = () => publish(`controllers/${controllerId}/reboot/sub`);

    const saveConfiguration = () => saveControllerConfiguration({ controllerId, ...controllerConfiguration });


    const [isConnected, publish] = usePubSubClient({
        [`controllers/${controllerId}/status/pub`]: onStatusMessage,
        [`controllers/${controllerId}/events/pub`]: onEventMessage,
    });


    useEffect(() => {
        if (isConnected) {
            publish(`controllers/${controllerId}/status/sub`);
        }

        getControllerConfiguration(controllerId).then(setControllerConfiguration);
    }, [isConnected]);


    return (
        <div className="p-4">
            <Input type="text" value={controllerId} />

            {controllerConfiguration && (
                <div>
                    {!controllerState && <div className="p-4">Connecting...</div>}

                    {controllerState && <ControllerState state={controllerState} />}

                    <hr />

                    <ControllerConfigurationForm state={controllerConfiguration} onChange={setControllerConfiguration} />

                    <div className="flex gap-4 justify-end pt-3">
                        <Button onClick={saveConfiguration}>
                            Save
                        </Button>

                        <Button onClick={rebootController} disabled={!isConnected}>
                            Reboot
                        </Button>

                    </div>

                </div>
            )}
        </div>
    );
};
