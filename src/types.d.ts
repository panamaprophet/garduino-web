export interface ControllerState {
    temperature: number;
    humidity: number;
    isOn: boolean;
    fanSpeed: number;
    stabilityFactor: number;
}

export interface ControllerConfiguration {
    onTime: string;
    duration: number;
    fanSpeed: number;
    thresholdTemperature: number;
}
