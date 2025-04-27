import { useEffect, useMemo, useRef, useState } from 'react';
import { queries } from '../../api/queries';
import { useQuery } from '@tanstack/react-query';
import { clearCanvas, createSmoothLine, createText, upscaleCanvas } from '@/shared/lib/canvas';

const normalize = (value: number, min: number, max: number, canvasSize: number) => {
    return ((value - min) / (max - min)) * canvasSize;
};

const formatDate = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}`;
};

export const ControllerHistoricalData = ({ controllerId }: { controllerId: string }) => {
    const [startDate] = useState(Date.now() - (24 * 60 * 60 * 1000) / 2);
    const [endDate] = useState(Date.now());

    const { data = [] } = useQuery(queries.historicalData(controllerId, startDate, endDate))

    const updates = data.filter((item) => item.event === 'update').sort((a, b) => a.ts - b.ts);

    const dates = useMemo(() => updates.map((item) => formatDate(new Date(item.ts))), [data]);
    const humidity = useMemo(() => updates.map((item) => item.humidity), [data]);
    const temperature = useMemo(() => updates.map((item) => item.temperature), [data]);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [tooltip, setTooltip] = useState<{ x: number; y: number; index: number }>();
    const [hoverLinePosition, setHoverLinePosition] = useState<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (!canvas || !ctx) {
            return;
        }

        const { width, height } = canvas.getBoundingClientRect();

        upscaleCanvas(ctx, width, height);

        clearCanvas(ctx);

        const offset = 10;
        const innerWidth = width - 2 * offset;
        const innerHeight = height - 2 * offset;

        const min = Math.min(...humidity, ...temperature);
        const max = Math.max(...humidity, ...temperature);

        const multiplier = Math.pow(10, max.toString().length - 1) / 2;
        const range = max - min;

        ctx.font = '8px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'left';

        for (let i = 0; i < max; i++) {
            const value = i * multiplier;

            const y = offset + innerHeight - normalize(value, min, min + range, innerHeight);

            createText(ctx, offset - 10, y + 4, value.toString(), { textAlign: 'left' });
        }

        const humidityCoordinates = humidity.map<[x: number, y: number]>((value, index) => [
            offset + (index / (humidity.length - 1)) * innerWidth,
            offset + innerHeight - normalize(value, min, max, innerHeight),
        ]);

        const temperatureCoordinates = temperature.map<[x: number, y: number]>((value, index) => [
            offset + (index / (temperature.length - 1)) * innerWidth,
            offset + innerHeight - normalize(value, min, max, innerHeight),
        ]);

        createSmoothLine(ctx, humidityCoordinates, 'oklch(58.8% 0.158 241.966)');
        createSmoothLine(ctx, temperatureCoordinates, 'oklch(59.6% 0.145 163.225)');

        const canvasMouseMoveListener = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;

            setHoverLinePosition(mouseX);

            let closestPoint = null;
            let minDistance = Infinity;

            /* cooridantes */ humidityCoordinates.forEach(([x, y], index) => {
                const distance = Math.sqrt((x - mouseX) ** 2);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestPoint = { x, y, index };
                }
            });

            if (closestPoint && minDistance < 10) {
                const { x, y, index } = closestPoint;

                setTooltip({ x: x + 10, y: y - 10, index });
            } else {
                setTooltip(undefined);
            }
        };

        const canvasMouseLeaveListener = () => {
            setHoverLinePosition(undefined);
            setTooltip(undefined);
        };

        canvas.addEventListener('mousemove', canvasMouseMoveListener);
        canvas.addEventListener('mouseleave', canvasMouseLeaveListener);

        return () => {
            canvas.removeEventListener('mousemove', canvasMouseMoveListener);
            canvas.removeEventListener('mouseleave', canvasMouseLeaveListener);
        };
    }, [data]);

    return (
        <div className="w-full p-2 border rounded-lg shadow-xs relative">
            <canvas ref={canvasRef} className="w-full h-full" />

            {typeof hoverLinePosition !== 'undefined' && (
                <div
                    className="absolute top-0 bottom-0 w-px bg-slate-400 pointer-events-none"
                    style={{ left: `${hoverLinePosition}px` }}
                />
            )}

            {tooltip && (
                <div className="pointer-events-none text-xs absolute p-3 shadow-xs rounded-lg bg-white/50" style={{ top: tooltip.y, left: tooltip.x }}>
                    <div className="font-medium">{dates[tooltip.index]}</div>
                    <div className="text-emerald-600">Temperature {temperature[tooltip.index]}℃</div>
                    <div className="text-sky-600">Humidity {humidity[tooltip.index]}%</div>
                </div>
            )}
        </div>
    );
}
