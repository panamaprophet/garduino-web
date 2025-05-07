export const formatLabel = (value: number) => {
    if (value >= 1000000) {
        return `${(value / 10000000).toFixed(1)}M`;
    }

    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
    }

    if (!Number.isInteger(value)) {
        return value.toFixed(1);
    }

    return value;
};
