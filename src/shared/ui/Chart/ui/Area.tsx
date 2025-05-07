interface Props {
    color: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export const Area = ({ color, x, y, width, height }: Props) => (
    <rect
        className="opacity-40 pointer-events-none"
        y={y}
        x={x}
        width={width}
        height={height}
        fill={color}
    />
);
