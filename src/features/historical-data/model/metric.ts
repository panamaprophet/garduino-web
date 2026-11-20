export type Metric = {
    label: string;
    color: string;
    reading: string;
    transform: (value: number) => number;
    formatter: (value: number) => string;
};

const temperature: Metric = {
    label: 'Temperature',
    color: 'oklch(59.6% 0.145 163.225)',
    reading: 'sensor.temperature',
    transform: (value: number) => Math.round(value * 10) / 10,
    formatter: (value: number) => `${value}℃`,
};

const humidity: Metric = {
    label: 'Humidity',
    color: 'oklch(58.8% 0.158 241.966)',
    reading: 'sensor.humidity',
    transform: (value: number) => Math.round(value * 10) / 10,
    formatter: (value: number) => `${value}%`,
};

const fanSpeed: Metric = {
    label: 'Fan Speed',
    color: 'oklch(60.4% 0.132 83.420)',
    reading: 'fan.speed',
    transform: (value: number) => Math.trunc(value / 255 * 100),
    formatter: (value: number) => `${value.toFixed()}%`,
};

export const metrics = {
    temperature,
    humidity,
    fanSpeed,
};
