import { ComponentProps, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Chart } from '@/shared/ui/Chart';
import { formatDate } from '@/shared/lib/date';

import { queries } from '../../api/queries';

export const ControllerHistoricalData = ({ controllerId }: { controllerId: string }) => {
    const [startDate] = useState(Date.now() - (24 * 60 * 60 * 1000) / 2);
    const [endDate] = useState(Date.now());

    const { data = [] } = useQuery(queries.historicalData(controllerId, startDate, endDate))

    const updates = data.filter((item) => item.event === 'update').sort((a, b) => a.ts - b.ts);

    const lines: ComponentProps<typeof Chart>['lines'] = [{
        label: 'Humidity',
        color: 'oklch(58.8% 0.158 241.966)',
        values: updates.map((item) => [formatDate(item.ts), item.humidity]),
    }, {
        label: 'Temperature',
        color: 'oklch(59.6% 0.145 163.225)',
        values: updates.map((item) => [formatDate(item.ts), item.temperature]),
    }];

    return (
        <div className="flex flex-col gap-1">
            <Chart lines={lines} />
        </div>
    );
};
