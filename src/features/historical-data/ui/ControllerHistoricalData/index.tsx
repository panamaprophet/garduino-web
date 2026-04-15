import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Tabs } from '@/shared/ui/Tabs';
import { Chart } from '@/shared/ui/Chart';
import { formatTime } from '@/shared/lib/date';

import { ControllerEventType, queries } from '@/entities/controller-event';

import { Skeleton } from '../Skeleton';
import { LabelGroup } from '../LabelGroup';

type Range = '1d' | '3d' | '7d';

const getRange = (range: Range) => {
    const dayInMilliseconds = 24 * 60 * 60 * 1000;

    const now = Date.now();

    const start = now - (now % dayInMilliseconds);
    const end = start + dayInMilliseconds;

    const map: Record<Range, [from: number, to: number]> = {
        '1d': [start - 1 * dayInMilliseconds, end],
        '3d': [start - 3 * dayInMilliseconds, end],
        '7d': [start - 7 * dayInMilliseconds, end],
    };

    return map[range];
};

export const ControllerHistoricalData = ({ controllerId }: { controllerId: string }) => {
    const [range, setRange] = useState<Range>('1d');
    const [startDate, endDate] = getRange(range);

    const { data = [], isLoading } = useQuery(queries.historicalData(controllerId, startDate, endDate));

    const updates = data.filter((item) => item.event === ControllerEventType.Update).sort((a, b) => a.ts - b.ts);

    const humidity = {
        label: 'Humidity',
        color: 'oklch(58.8% 0.158 241.966)',
        values: updates.map<[string, number]>((item) => [formatTime(item.ts), item.humidity]),
        formatter: (value: number) => `${value}%`,
    };

    const temperature = {
        label: 'Temperature',
        color: 'oklch(59.6% 0.145 163.225)',
        values: updates.map<[string, number]>((item) => [formatTime(item.ts), item.temperature]),
        formatter: (value: number) => `${value}℃`,
    };

    const fanSpeed = {
        label: 'Fan Speed',
        color: 'oklch(60.4% 0.132 83.420)',
        values: updates.map<[string, number]>((item) => [formatTime(item.ts), Math.trunc(item.fanSpeed / 255 * 100)]),
        formatter: (value: number) => `${value.toFixed()}%`,
    };

    const [visibleLines, setVisibleLines] = useState([temperature.label, humidity.label]);

    const setLineVisibility = (label: string) => {
        const changes = visibleLines.includes(label)
            ? visibleLines.filter((item => item !== label))
            : [...visibleLines, label];

        setVisibleLines(changes);
    };

    const lines = [humidity, temperature, fanSpeed];

    const chartLines = lines.filter(line => visibleLines.includes(line.label));
    const chartLabelFormatter = (value: number, date: string | number) => `${date} - ${value}`;

    return (
        <div className="flex flex-col gap-4 relative">
            <LabelGroup
                items={lines}
                currentItems={visibleLines}
                onChange={setLineVisibility}
            />

            {
                isLoading
                    ? <Skeleton />
                    : <Chart lines={chartLines} formatter={chartLabelFormatter} />
            }

            <Tabs
                tabs={['1d', '3d', '7d']}
                currentTab={range}
                onClick={setRange}
            />
        </div>
    );
};
