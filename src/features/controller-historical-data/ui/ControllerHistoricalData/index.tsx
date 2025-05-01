import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Chart } from '@/shared/ui/Chart';
import { Loader } from '@/shared/ui/Loader';
import { Checkbox } from '@/shared/ui/Checkbox';
import { formatDate } from '@/shared/lib/date';

import { queries } from '../../api/queries';

export const ControllerHistoricalData = ({ controllerId }: { controllerId: string }) => {
    const [startDate] = useState(Date.now() - (24 * 60 * 60 * 1000));
    const [endDate] = useState(Date.now());

    const { data = [], isLoading } = useQuery(queries.historicalData(controllerId, startDate, endDate))

    const updates = data.filter((item) => item.event === 'update').sort((a, b) => a.ts - b.ts);

    const humidity = {
        label: 'Humidity',
        color: 'oklch(58.8% 0.158 241.966)',
        values: updates.map<[string, number]>((item) => [formatDate(item.ts), item.humidity]),
        formatter: (value: number) => `${value}%`,
    };

    const temperature = {
        label: 'Temperature',
        color: 'oklch(59.6% 0.145 163.225)',
        values: updates.map<[string, number]>((item) => [formatDate(item.ts), item.temperature]),
        formatter: (value: number) => `${value}℃`,
    }

    const fanSpeed = {
        label: 'Fan Speed',
        color: 'oklch(60.4% 0.132 83.420)',
        values: updates.map<[string, number]>((item) => [formatDate(item.ts), (item.fanSpeed / 255) * 100]),
        formatter: (value: number) => `${value}%`,
    };

    const lines = [humidity, temperature, fanSpeed];

    const [visibleLines, setVisibleLines] = useState([temperature.label, humidity.label]);

    const setLineVisibility = (label: string) => {
        const changes = visibleLines.includes(label)
            ? visibleLines.filter((item => item !== label))
            : [...visibleLines, label];

        setVisibleLines(changes);
    };

    if (isLoading) {
        return <Loader status="Loading logs" />
    }

    return (
        <div className="flex flex-col gap-2">
            <Chart lines={lines.filter(line => visibleLines.includes(line.label))} />

            <div className="flex gap-3">
                {lines.map((line) => (
                    <label className="flex items-center gap-1" style={{ color: line.color }}>
                        <Checkbox
                            onClick={() => setLineVisibility(line.label)}
                            checked={visibleLines.includes(line.label)}
                            disabled={visibleLines.includes(line.label) && visibleLines.length === 1}
                        />
                        {line.label}
                    </label>
                ))}
            </div>
        </div>
    );
};
