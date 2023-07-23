import { useEffect, useState } from 'react';
import { usePubSubClient } from '../../hooks/usePubSubClient';
import { useControllerConfiguration } from '../../hooks/useControllerConfiguration';
import { ControllerConfigurationForm } from '../ControllerConfigurationForm';
import { ControllerStatePanel } from '../ControllerStatePanel';
import { Input } from '../Input';
import { Button } from '../Button';
import { ControllerId, ControllerState } from '../../types';


export const App = () => {
    const controllerId: ControllerId = 'a36805cc-35de-4c50-99de-936719924199';

    const [state, setState] = useState<ControllerState>({} as any);
    const [configuration, setConfiguration, saveConfiguration] = useControllerConfiguration(controllerId);

    const rebootController = () => publish(`controllers/${controllerId}/reboot/sub`);
    // const updateState = () => publish(`controllers/${controllerId}/status/sub`);

    const [isConnected, publish] = usePubSubClient({
        [`controllers/${controllerId}/status/pub`]: setState,
        [`controllers/${controllerId}/events/pub`]: ({ temperature, humidity }: { temperature: number, humidity: number }) => setState({ ...state, humidity, temperature }),
    });

    useEffect(() => {
        isConnected && publish(`controllers/${controllerId}/status/sub`);
    }, [isConnected]);

    return (
        <div className="p-4">
            <Input type="text" value={controllerId} />

            <div>
                {!state && <div className="p-4">Connecting...</div>}

                {state && <ControllerStatePanel state={state} />}

                <hr />

                {configuration && <ControllerConfigurationForm state={configuration} onChange={setConfiguration} />}

                <div className="flex gap-4 justify-end pt-3">
                    {/* <Button onClick={updateState}>
                        Update status
                    </Button> */}

                    <Button onClick={saveConfiguration}>
                        Save
                    </Button>

                    <Button onClick={rebootController} disabled={!isConnected}>
                        Reboot
                    </Button>
                </div>
            </div>
        </div>
    );
};
