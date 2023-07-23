import { useEffect, useState } from 'react';
import { ClockRange } from 'clock-range';
import { usePubSubClient } from '../../hooks/usePubSubClient';
import { getControllerConfiguration, saveControllerConfiguration } from '../../resolvers';
import { Bulb, Drop, Fan, Temperature } from '../Icon';


const inputClassList = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 appearance-none text-left";

const labelClassList = "block mb-2";

const buttonClassList = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";


export const App = () => {
    const [controllerState, setControllerState] = useState<{
        temperature: number,
        humidity: number,
        isOn: boolean,
        fanSpeed: number,
        stabilityFactor: number,
    }>({} as any);

    const [controllerConfiguration, setControllerConfiguration] = useState<any>();
    const controllerId = 'a36805cc-35de-4c50-99de-936719924199';

    const onStatusMessage = (message: any) => {
        setControllerState(message);
    };

    const onEventMessage = ({ temperature, humidity }: any) => {
        setControllerState({ ...controllerState, temperature, humidity });
    };

    const rebootController = () => {
        publish(`controllers/${controllerId}/reboot/sub`);
    };

    const saveConfiguration = () => {
        saveControllerConfiguration({ controllerId, ...controllerConfiguration });
    }

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

    const tmp = controllerConfiguration?.onTime.split(':').map(Number) ?? [0, 0];
    const onTime = tmp[0] + tmp[1] / 60;

    let offTime = onTime + (controllerConfiguration?.duration ?? 0) / 1000 / 60 / 60;

    if (offTime >= 24) offTime -= 24;

    const durationHours = (controllerConfiguration?.duration ?? 0) / 1000 / 60 / 60 | 0;
    const durationMinutes = ((controllerConfiguration?.duration ?? 0) / 1000 / 60 / 60) % 1 * 60 | 0;
    const durationTime = `${durationHours.toString().padStart(2, '0')}:${durationMinutes.toString().padStart(2, '0')}`;

    const fanSpeedPercentage = ((controllerConfiguration?.fanSpeed / 255) * 100).toFixed();

    return (
        <div className="p-4">
            <p className="mb-2">
                <strong className={inputClassList}>{controllerId}</strong>
            </p>

            {controllerConfiguration && (
                <div>
                    <div className="flex justify-between items-center p-4">
                        <div className="flex flex-col items-center">
                            <Bulb /> {controllerState ? (controllerState?.isOn ? 'On' : 'Off') : '-'}
                        </div>
                        <div className="flex flex-col items-center">
                            <Drop /> {controllerState?.humidity + '%'}
                        </div>
                        <div className="flex flex-col items-center">
                            <Temperature /> {controllerState?.temperature + '℃'}
                        </div>
                        <div className="flex flex-col items-center">
                            <Fan /> {controllerState?.fanSpeed / 255 * 100 + '%'}
                        </div>
                    </div>

                    <hr />

                    <div className="w-80 h-80 p-4 mx-auto">
                        <ClockRange
                            range={[onTime, offTime]}
                            // @ts-ignore: should be fixed in clock-range package
                            onChange={(time: [number, number]) => {
                                const hours = time[0] | 0;
                                const minutes = (time[0] % 1 * 60) | 0;

                                let duration = 60 * 60 * 1000 * Math.abs(
                                    (time[0] > time[1])
                                        ? 24 - time[0] + time[1]
                                        : time[1] - time[0]
                                );

                                const onTime = [hours, minutes].map(t => t.toString().padStart(2, '0')).join(':');

                                setControllerConfiguration({
                                    ...controllerConfiguration,
                                    onTime,
                                    duration,
                                });
                            }}
                        />
                    </div>

                    <label className={labelClassList}>
                        On time:
                        <input
                            type="time"
                            className={inputClassList}
                            value={controllerConfiguration.onTime}
                            onChange={event => {
                                setControllerConfiguration({
                                    ...controllerConfiguration,
                                    onTime: event.target.value,
                                });
                            }}
                        />
                    </label>

                    <label className={labelClassList}>
                        Duration:

                        <input
                            className={inputClassList}
                            value={durationTime}
                            onInput={event => {
                                const time = (event.target as HTMLInputElement).value.split(':').map(Number) as [number, number];
                                const duration = time[0] * 60 * 60 * 1000 + (time[1] / 100 * 60) * 60 * 1000;

                                setControllerConfiguration({
                                    ...controllerConfiguration,
                                    duration,
                                });
                            }}
                            type="time"
                            max="24"
                            min="0"
                        />
                    </label>

                    <label className={labelClassList}>
                        Threshold temperature, ℃:

                        <input
                            type="number"
                            className={inputClassList}
                            value={controllerConfiguration.thresholdTemperature}
                            onChange={event => {
                                setControllerConfiguration({
                                    ...controllerConfiguration,
                                    thresholdTemperature: Number(event.target.value),
                                });
                            }}
                        />
                    </label>

                    <label className={labelClassList}>
                        Fan speed: {fanSpeedPercentage}%

                        <input
                            className={`${inputClassList} !p-0`}
                            value={controllerConfiguration.fanSpeed}
                            type="range"
                            max="255"
                            min="0"
                            step="1"
                            onChange={event => {
                                setControllerConfiguration({
                                    ...controllerConfiguration,
                                    fanSpeed: Number(event.target.value),
                                });
                            }}
                        />
                    </label>

                    <div className="flex gap-4 justify-end pt-6">

                        <button className={buttonClassList} onClick={saveConfiguration}>
                            Save
                        </button>

                        <button
                            className={buttonClassList}
                            onClick={rebootController}
                            disabled={!isConnected}
                        >
                            {!isConnected ? 'Connecting...' : 'Reboot'}
                        </button>

                    </div>

                </div>
            )}
        </div>
    );
};
