import { ComponentProps, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Chart } from '@/shared/ui/Chart';
import { Loader } from '@/shared/ui/Loader';
import { formatDate } from '@/shared/lib/date';

import { queries } from '../../api/queries';

export const ControllerHistoricalData = ({ controllerId }: { controllerId: string }) => {
    const [startDate] = useState(Date.now() - (24 * 60 * 60 * 1000));
    const [endDate] = useState(Date.now());

    const { data = [], isLoading } = useQuery(queries.historicalData(controllerId, startDate, endDate))

    const updates = data.filter((item) => item.event === 'update').sort((a, b) => a.ts - b.ts);

    const lines: ComponentProps<typeof Chart>['lines'] = [{
        label: 'Humidity',
        color: 'oklch(58.8% 0.158 241.966)',
        values: updates.map((item) => [formatDate(item.ts), item.humidity]),
        formatter: (value: number) => `${value}%`,
    }, {
        label: 'Temperature',
        color: 'oklch(59.6% 0.145 163.225)',
        values: updates.map((item) => [formatDate(item.ts), item.temperature]),
        formatter: (value: number) => `${value}℃`,
    }/* , {
        label: 'Fan Speed',
        color: 'oklch(60.4% 0.132 93.420)',
        values: updates.map((item) => [formatDate(item.ts), item.fanSpeed]),
        formatter: (value: number) => `${value}%`,
    } */];

    if (isLoading) {
        return <Loader status="Loading logs" />
    }

    return (
        <div className="flex flex-col gap-1">
            <Chart lines={lines} />
        </div>
    );
};
