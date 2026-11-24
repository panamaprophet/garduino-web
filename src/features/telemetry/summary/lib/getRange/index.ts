import type { SummaryInterval } from '@/entities/telemetry';
import { DAY_IN_MILLISECONDS, HOUR_IN_MILLISECONDS, formatDayTime, formatTime, type Instant } from '@/shared/lib/date';
import type { Range } from '../../model/range';

interface RangeConfig {
    durationMs: number;
    interval: SummaryInterval;
    intervalMs: number;
    formatLabel: (ts: Instant) => string;
}

const config: Record<Range, RangeConfig> = {
    '1d': { durationMs: DAY_IN_MILLISECONDS, interval: '10m', intervalMs: HOUR_IN_MILLISECONDS / 6, formatLabel: formatTime },
    '3d': { durationMs: 3 * DAY_IN_MILLISECONDS, interval: '1h', intervalMs: HOUR_IN_MILLISECONDS, formatLabel: formatDayTime },
    '7d': { durationMs: 7 * DAY_IN_MILLISECONDS, interval: '1h', intervalMs: HOUR_IN_MILLISECONDS, formatLabel: formatDayTime },
};

export const getRange = (range: Range, now = Date.now()) => {
    const { durationMs, interval, intervalMs, formatLabel } = config[range];

    const to = Math.ceil(now / intervalMs) * intervalMs;
    const from = to - durationMs;

    return {
        from: new Date(from).toISOString(),
        to: new Date(to).toISOString(),
        interval,
        formatLabel,
    };
};
