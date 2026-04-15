interface Props {
    type: 'horizontal' | 'vertical',
    top?: number;
    left?: number;
    size: number;
    color?: string;
}

export const GuideLine = ({ color = '#eee', type, top, left, size }: Props) => {
    const points = type === 'horizontal'
        ? `${left ?? 0},${top} ${size},${top}`
        : `${left},0 ${left},${size}`;

    return (
        <polyline
            points={points}
            stroke={color}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
        />
    );
};
