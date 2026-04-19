import type { Range } from '../../model/range';

export const getRange = (range: Range): [from: number, to: number] => {
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
