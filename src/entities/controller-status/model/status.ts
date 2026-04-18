export interface Status {
    fan: {
        currentSpeed: number;
    };
    light: {
        isOn: boolean;
    };
    sensor: {
        temperature: number;
        humidity: number;
        stabilityFactor: number;
    };
    event: 'update';
}
