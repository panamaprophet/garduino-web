import { MouseEventHandler, ReactNode, useState } from 'react';
import { XLabel, YLabel } from './ui/GuideLabel';
import { Line } from './ui/Line';
import { GuideLine } from './ui/GuideLIne';
import { formatLabel } from './lib/formatLabel';
import { Dot } from './ui/Dot';

interface Line {
    label: string;
    color: string;
    values: Array<[x: number | string, y: number]>;
}

interface Props {
    lines: Array<Line>
    formatter?: (y: number, x: number | string) => string;
}

export const Chart = (props: Props) => {
    const { lines } = props;
    const { formatter = (value, label) => `${value} - ${label}` } = props;

    const xValues = lines.at(0)?.values.map(([value]) => value) ?? [];
    const yValues = lines.flatMap((line) => line.values.map(([, value]) => value));

    const xMin = 0;
    const xMax = xValues.length - 1;
    const yMax = Math.max(...yValues) || 1;

    const multiplier = Math.min(10 ** Math.max(1, Math.trunc(yMax).toString().length - 1), Math.ceil(yMax));
    const offset = 0;

    const width = 100; /* in percent */
    const height = Math.ceil(yMax / multiplier) * multiplier;

    const columns: ReactNode[] = [];
    const xLabels: ReactNode[] = [];
    const yLabels: ReactNode[] = [];

    const columnsCount = Math.min(5, xValues.length);
    const rowsCount = 5;

    const stepX = (width - offset * 2) / Math.max(1, (xMax - xMin));
    const stepY = (xValues.length - 1) / Math.max(columnsCount - 1, 1);

    for (let i = 0; i < columnsCount; i++) {
        const columnIndex = Math.trunc(i * stepY);
        const left = columnsCount === 1 ? (width / 2) : (columnIndex * stepX + offset);
        const xLabel = xValues[columnIndex];

        columns.push(<GuideLine key={`guide_vertical_${left}`} type="vertical" left={left} size={height} />);
        xLabels.push(<XLabel key={`label_${left}`} position={left}>{xLabel}</XLabel>);
    }

    for (let i = 0; i < height; i += height / rowsCount) {
        columns.push(
            <GuideLine key={`guide_horizontal_${i}`} type="horizontal" top={i} left={offset} size={width - offset} />
        );

        yLabels.push(
            <YLabel key={`guide_label_${i}`} position={(height - i) / (height / 100)}>
                {formatLabel(height - i)}
            </YLabel>
        );
    }

    const [dots, setDots] = useState<[
        x: number,
        y: number,
        value: number,
        label: string | number,
        color: string,
    ][]>([]);

    const onMouseMove: MouseEventHandler<HTMLDivElement> = (event) => {
        const { left, width } = event.currentTarget.getBoundingClientRect();

        const mouseX = Math.round(((event.clientX - left) / width) * 100); /* in percent */
        const distance = stepX / 2;

        const points: typeof dots = [];

        lines.forEach(({ values, color }) => {
            for (const [index, value] of values.entries()) {
                // @todo: skip first {mouseX}% of items
                const left = index * stepX; /* + offset / 2; */
                const bottom = (value[1] / height) * 100;

                if (Math.abs(left - mouseX) < distance) {
                    points.push([left, bottom, value[1], value[0], color]);
                }

                if (left - mouseX > distance) {
                    break;
                }
            }
        });

        setDots(points);
    };

    const onMouseLeave: MouseEventHandler<HTMLDivElement> = () => {
        setDots([]);
    };

    return (
        <div className="w-full h-full">
            <div className="relative flex h-full">
                <div data-role="y-labels" className="w-6 relative">
                    {yLabels}
                </div>

                <div
                    onMouseMove={onMouseMove}
                    onMouseLeave={onMouseLeave}
                    className="relative w-full h-full border-b border-[#191926]/8"
                >
                    <svg
                        data-role="chart"
                        preserveAspectRatio="none"
                        viewBox={`${offset} 0 ${width - offset * 2} ${height}`}
                    >
                        {columns}

                        {lines.map(((line) =>
                            <Line
                                key={line.label}
                                values={line.values.map(([, value]) => value)}
                                width={width}
                                height={height}
                                offset={offset}
                                color={line.color}
                            />
                        ))}
                    </svg>

                    <div data-role="dots" className="absolute top-0 left-0 w-full h-full">
                        {dots.map(([x, y, value, label, color], index) => (
                            <Dot
                                key={index}
                                left={x}
                                bottom={y}
                                color={color}
                                value={formatter(value, label)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div data-role="x-labels" className="relative left-3 w-full pt-4">
                {xLabels}
            </div>
        </div>
    );
};
