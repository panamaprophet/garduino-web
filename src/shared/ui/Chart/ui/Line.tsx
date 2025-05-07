import { useId } from "react";

interface Props {
    values: number[];
    width: number;
    height: number;
    offset?: number;
    color?: string;
}

export const Line = ({ values, width, height, offset = 0, color = 'black' }: Props) => {
    const step = (width - offset * 2) / (values.length - 1);
    const gradientId = useId();

    const lineCoordinates = values.reduce((result, value, index) => {
        const action = index === 0 ? 'M' : 'L';

        const x = index * step + offset;
        const y = height - value;

        return `${result} ${action} ${x} ${y}`;
    }, '');

    const fillTopCoordinates = values.reduce((result, value, index) => {
        const x = index * step + offset;
        const y = height - value;

        return `${result} ${x},${y}`;
    }, '');

    const fillCoordinates = `0,${height} ${fillTopCoordinates} ${width}, ${height}`;

    return (
        <>
            <defs>
                <linearGradient id={gradientId} x2="0%" y2="100%">
                    <stop offset="0" stopColor={color} stopOpacity={0.20} />
                    <stop offset="1" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>

            <polygon points={fillCoordinates} fill={`url(#${gradientId})`} />

            <path
                d={lineCoordinates}
                strokeWidth="2"
                stroke={color}
                fill="transparent"
                vectorEffect="non-scaling-stroke"
            />       
        </>
    );
};
