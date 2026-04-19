import { useQuery } from '@tanstack/react-query';
import { formatTime } from '@/shared/lib/date';
import { queries, ControllerEventType } from '@/entities/controller-event';
import { metrics, type Metric } from '../../model/metric';

export type MetricData = Metric & {
    label: string;
    values: Array<[string, number]>;
};

const createMetricData = () =>
    Object
        .entries(metrics)
        .reduce<Record<string, MetricData>>((result, [metricId, metric]) => ({
            ...result,
            [metricId]: { ...metric, values: [] },
        }), {});

export const useControllerHistoricalData = (controllerId: string, startDate: number, endDate: number) => {
    const { data = [], isLoading } = useQuery(queries.historicalData(controllerId, startDate, endDate));

    const metricData = createMetricData();

    const updates = data
        .filter((item) => item.event === ControllerEventType.Update)
        .sort((a, b) => a.ts - b.ts);

    updates.forEach((item) => {
        const ts = formatTime(item.ts);

        if ('humidity' in item) {
            metricData['humidity']?.values.push([ts, item.humidity]);
        }

        if ('temperature' in item) {
            metricData['temperature']?.values.push([ts, item.temperature]);
        }

        if ('fanSpeed' in item) {
            metricData['fanSpeed']?.values.push([ts, Math.trunc(item.fanSpeed / 255 * 100)]);
        }

        if ('sensor' in item && item.sensor) {
            metricData['humidity']?.values.push([ts, item.sensor.humidity]);
            metricData['temperature']?.values.push([ts, item.sensor.temperature]);
        }

        if ('fan' in item && item.fan) {
            metricData['fanSpeed']?.values.push([ts, Math.trunc(item.fan.currentSpeed / 255 * 100)]);
        }
    });

    return { isLoading, data: Object.values(metricData) };
};
