export type Metric = {
    label: string;
    color: string;
    formatter: (value: number) => string;
};

const temperature: Metric = {
    label: 'Temperature',
    color: 'oklch(59.6% 0.145 163.225)',
    formatter: (value: number) => `${value}℃`,
};

const humidity: Metric = {
    label: 'Humidity',
    color: 'oklch(58.8% 0.158 241.966)',
    formatter: (value: number) => `${value}%`,
};

const fanSpeed: Metric = {
    label: 'Fan Speed',
    color: 'oklch(60.4% 0.132 83.420)',
    formatter: (value: number) => `${value.toFixed()}%`,
};

export const metrics = {
    temperature,
    humidity,
    fanSpeed,
};