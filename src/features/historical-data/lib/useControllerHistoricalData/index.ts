import { useQuery } from '@tanstack/react-query';
import { queries } from '@/entities/controller-event';
import { metrics, type Metric } from '../../model/metric';
import type { Range } from '../../model/range';
import { getRange } from '../getRange';

export type MetricData = Metric & {
    values: Array<[string, number]>;
};

export const useControllerHistoricalData = (controllerId: string, range: Range) => {
    const { from, to, interval, formatLabel } = getRange(range);

    const { data: buckets = [], isLoading } = useQuery(queries.summary(controllerId, from, to, interval));

    const allMetrics = Object.values(metrics);

    const availableMetrics = allMetrics.filter((metric) => buckets.some((bucket) => bucket.readings[metric.reading]));

    const completeBuckets = buckets.filter((bucket) => {
        return availableMetrics.length > 0 && availableMetrics.every((metric) => bucket.readings[metric.reading]);
    });

    const data = allMetrics.map<MetricData>((metric) => ({
        ...metric,
        values: availableMetrics.includes(metric)
            ? completeBuckets.map((bucket) => [
                formatLabel(bucket.start),
                metric.transform(bucket.readings[metric.reading]?.avg ?? 0),
            ])
            : [],
    }));

    return { isLoading, data };
};
