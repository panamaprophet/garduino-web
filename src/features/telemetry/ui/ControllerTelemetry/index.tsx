import { useState } from 'react';

import { Tabs } from '@/shared/ui/Tabs';
import { Chart } from '@/shared/ui/Chart';

import { Skeleton } from '../Skeleton';
import { LabelGroup } from '../LabelGroup';
import { useControllerTelemetry } from '../../lib/useControllerTelemetry';
import type { Range } from '../../model/range';

export const ControllerTelemetry = ({ controllerId }: { controllerId: string }) => {
    const [range, setRange] = useState<Range>('1d');
    const { isLoading, data } = useControllerTelemetry(controllerId, range);

    const [visibleLines, setVisibleLines] = useState(data.map((item) => item.label).slice(0, 1));

    const setLineVisibility = (label: string) => {
        const changes = visibleLines.includes(label)
            ? visibleLines.filter((item) => item !== label)
            : [...visibleLines, label];

        setVisibleLines(changes);
    };

    const chartLines = data.filter((item) => visibleLines.includes(item.label) && item.values.length > 0);
    const chartLabelFormatter = (value: number, date: string | number) => `${date} - ${value}`;

    return (
        <div className="flex flex-col gap-4 relative">
            <LabelGroup
                items={data}
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
