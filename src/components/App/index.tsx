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
import { withAuth } from '@/hooks/useAuth';

import { ControllerConfiguration, ControllerState } from '@/types';
import { UUID } from 'crypto';

export const App = withAuth(() => {
    const [controllerId, setLocationHash] = useLocationHash();
    const [controllerIds, refetchControllerIds] = useControllerList();

    const { state: configuration, create, update } = useControllerConfiguration(controllerId as UUID);

    const [state, setState] = useState<ControllerState>();
    const [draft, setDraft] = useState<ControllerConfiguration>();

    const topics = useMemo(() => {
        if (!controllerId) {
            return {};
        }

        return {
            [`controllers/${controllerId}/status/pub`]: (data: { [k: string]: unknown }) => {
                const changes = data as unknown as ControllerState;
                setState(state => ({ ...state, ...changes }));
            },
            [`controllers/${controllerId}/events/pub`]: (data: { [k: string]: unknown }) => {
                const changes = data as unknown as Pick<ControllerState, 'temperature' | 'humidity'>
                setState(state => ({ ...state!, ...changes }));
            },
        };
    }, [controllerId]);

    const [isConnected, publish] = usePubSubClient(topics);

    const rebootController = () => publish(`controllers/${controllerId}/reboot/sub`);
    const updateState = () => publish(`controllers/${controllerId}/status/sub`);

    useEffect(() => {
        if (isConnected) {
            updateState();
        }
    }, [isConnected]);

    const hasTemperatureWarning = Boolean(state && configuration && (state.temperature > configuration.thresholdTemperature));

    const onCreateController = async () => {
        await create();
        await refetchControllerIds();
    };

    return (
        <div className="p-4 max-w-md mx-auto text-sm">
            <div className="flex gap-2">
                <Dropdown
                    title="Select controller"
                    value={controllerId}
                    options={controllerIds}
                    onChange={setLocationHash}
                />
                <Button onClick={onCreateController}>+</Button>
            </div>

            {controllerId && (
                <div className="border-b border-b-gray-200">
                    {state && <StatePanel state={state} hasTemperatureWarning={hasTemperatureWarning} />}
                    {!state && <Loader status="Loading" />}
                </div>
            )}

            {configuration && (
                <>
                    <ConfigurationForm state={draft ?? configuration} onChange={setDraft} />

                    <hr className="my-2.5" />

                    <div className="flex gap-2 justify-between pt-4">
                        <Button onClick={rebootController} disabled={!isConnected}>
                            Reboot
                        </Button>

                        <div className="flex gap-2">
                            <Button onClick={updateState} disabled={!isConnected}>
                                <Arrows />
                            </Button>

                            <Button onClick={() => update(draft ?? configuration)}>
                                Save
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
});
