import { useRef, useState, useEffect, useMemo, MouseEvent, TouchEvent } from 'react';
import { clearCanvas, createCircle, createLine, createSmoothLine, createText, upscaleCanvas } from '@/shared/lib/canvas';

interface Line {
    values: Array<[key: string | number, value: number]>;
    color: string;
    label: string;
    formatter?: (value: number) => string;
}

interface Props {
    lines: Array<Line>;
}

const normalize = (value: number, min: number, max: number, canvasSize: number) => {
    return ((value - min) / (max - min)) * canvasSize;
};

const getClosestPoint = (target: { x: number }, points: Array<[x: number, y: number]>) => {
    let closestPoint = -1;
    let minDistance = Infinity;

    points.forEach(([x], index) => {
        const distance = Math.sqrt((x - target.x) ** 2);

        if (distance < minDistance) {
            minDistance = distance;
            closestPoint = index;
        }
    });

    return closestPoint;
};

export const Chart = ({ lines }: Props) => {
    const offset = 10;

    const keys = useMemo(() => lines.flatMap((line) => line.values.map(([key]) => key)), [lines]);
    const values = useMemo(() => lines.flatMap((line) => line.values.map(([, value]) => value)), [lines]);

    const min = Math.min(...values);
    const max = Math.max(...values);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [tooltips, setTooltips] = useState<Array<{ x: number; y: number; index: number; label: string }>>([]);

    const dateLabel = tooltips.length ? keys[tooltips.at(0)?.index!] : `${keys[0]} - ${keys.at(-1)}`

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (!canvas || !ctx) {
            return;
        }

        const { width, height } = canvas.getBoundingClientRect();

        upscaleCanvas(ctx, width, height);

        const innerWidth = width - 2 * offset;
        const innerHeight = height - 2 * offset;

        const multiplier = Math.pow(10, max.toString().length - 1) / 2;
        const range = max - min;

        clearCanvas(ctx);

        // grid

        for (let i = 0; i < max; i++) {
            const value = i * multiplier;

            const y = offset + innerHeight - normalize(value, min, min + range, innerHeight);

            createLine(ctx, offset, y, width - offset, y, { color: 'rgba(0, 0, 0, 0.05)', lineWidth: 1 });

            createText(ctx, offset, y + 6, value.toString(), { textAlign: 'left', color: 'lightgray', fontSize: 8 });
        }

        // lines + dots

        lines.forEach(({ values, label, color }) => {
            const cooridantes = values.map<[x: number, y: number]>(([, value], index) => [
                offset + (index / (values.length - 1)) * innerWidth,
                offset + innerHeight - normalize(value, min, max, innerHeight),
            ]);

            createSmoothLine(ctx, cooridantes, color);

            const tooltip = tooltips.find((item) => item.label === label);

            if (tooltip) {
                createCircle(ctx, tooltip.x, tooltip.y, 3, { color: 'white', strokeWidth: 2, strokeColor: color });
            }
        });
    }, [values, tooltips]);

    const onPointerMove = (event: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) {
            return;
        }

        const isTouch = 'touches' in event;

        const clientX = (isTouch ? event.touches[0]?.clientX : event.clientX) ?? 0;

        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = clientX - rect.left;

        const innerWidth = rect.width - 2 * offset;
        const innerHeight = rect.height - 2 * offset;

        const result = lines.reduce<Array<{ x: number, y: number, index: number, label: string }>>((result, { values, label }) => {
            const cooridantes = values.map<[x: number, y: number]>(([, value], index) => [
                offset + (index / (values.length - 1)) * innerWidth,
                offset + innerHeight - normalize(value, min, max, innerHeight),
            ]);

            const index = getClosestPoint({ x: mouseX }, cooridantes);
            const point = cooridantes[index];

            if (point) {
                result.push({ x: point[0], y: point[1], label, index });
            }

            return result;
        }, []);

        setTooltips(result);
    };

    const onPointerLeave = () => {
        setTooltips([]);
    };

    const tooltipItems = tooltips.reduce<Array<{ x: number; y: number; label: string }>>((result, tooltip) => {
        const line = lines.find(({ label }) => label === tooltip.label);
        const value = line?.values[tooltip.index]?.[1];

        if (!line || !value) {
            return result;
        }

        const label = line.formatter?.(value) ?? value.toString();

        return [...result, { x: tooltip.x, y: tooltip.y, label }];
    }, []);

    return (
        <div className="flex flex-col gap-1">
            <div className="text-sm h-8 my-2 flex items-center" >
                {dateLabel}
            </div>

            <div className="w-full p-2 border rounded-lg shadow-xs relative">
                <canvas
                    ref={canvasRef}
                    className="w-full aspect-video"
                    onMouseMove={onPointerMove} onMouseLeave={onPointerLeave}
                    onTouchMove={onPointerMove} onTouchEnd={onPointerLeave}
                />

                {tooltipItems.map((tooltip, index) => (
                    <div
                        key={index}
                        className="pointer-events-none text-xs absolute shadow-xs rounded-lg -translate-y-3/4"
                        style={{ top: tooltip.y, left: tooltip.x }}
                    >
                        {tooltip.label}
                    </div>
                ))}
            </div>
        </div>
    );
};
