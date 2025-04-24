import { useRef, useEffect } from 'react';
import { hoursToTime, millisecondsToTime, timeToMilliseconds } from '@/shared/lib/date';
import { upscaleCanvas, clearCanvas, createArc, createCircle, createText, createLine } from '@/shared/lib/canvas';
import { timeToAngle, angleToCoords, getAngleFromCoordinates, getClosestHandle, angleToTime } from '@/shared/lib/trigonometry';

interface Props {
    onTime: string;
    duration: number;
    onChange: (onTime: string, duration: number) => void;
}

const getCoordinatesFromEvent = (event: MouseEvent | TouchEvent) => {
    const isTouch = 'touches' in event;

    const x = (isTouch ? event.touches[0]?.clientX : event.clientX) ?? 0;
    const y = (isTouch ? event.touches[0]?.clientY : event.clientY) ?? 0;

    return { x, y };
};

export function CircularSlider({ onTime, duration, onChange }: Props) {
    const startAngle = timeToAngle(onTime);
    const endAngle = timeToAngle(millisecondsToTime(timeToMilliseconds(onTime) + duration)) % 360;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const handleRef = useRef<'start' | 'end' | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (!canvas || !ctx) {
            return;
        }

        const { width, height } = canvas.getBoundingClientRect();

        upscaleCanvas(ctx, width, height);

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 40;

        clearCanvas(ctx, width, height);

        createCircle(ctx, centerX, centerY, radius, { color: '#f3f4f6' });

        for (let hour = 0; hour < 24; hour++) {
            const angle = hour * 15 - 90;
            const radians = angle * (Math.PI / 180);
            const isMainMarker = hour % 6 === 0;
            const innerRadius = isMainMarker ? radius - 15 : radius - 10;
            const outerRadius = radius - 2;

            const innerX = centerX + innerRadius * Math.cos(radians);
            const innerY = centerY + innerRadius * Math.sin(radians);
            const outerX = centerX + outerRadius * Math.cos(radians);
            const outerY = centerY + outerRadius * Math.sin(radians);

            createLine(ctx, innerX, innerY, outerX, outerY, { color: isMainMarker ? '#6b7280' : '#d1d5db', lineWidth: isMainMarker ? 2 : 1 });

            if (isMainMarker) {
                const textRadius = radius + ([6, 18].includes(hour) ? 20 : 10);
                const textX = centerX + textRadius * Math.cos(radians);
                const textY = centerY + textRadius * Math.sin(radians);

                createText(ctx, textX, textY, `${hour}:00`, { color: '#6b7280', fontSize: 12 });
            }
        }

        const startRad = (startAngle - 90) * (Math.PI / 180);
        const endRad = (endAngle - 90) * (Math.PI / 180);

        createArc(ctx, centerX, centerY, radius - 20, startRad, endRad, { color: 'rgba(251,191,36, 0.8)', lineWidth: 30 });

        const drawHandle = (angle: number, icon: 'start' | 'end') => {
            const { x, y } = angleToCoords(angle, radius - 20, centerX, centerY);

            const content = icon === 'start' ? '☀️' : '🌙';
            const color = icon === 'start' ? 'rgba(245,158,11,0.8)' : 'rgba(107,114,128,0.8)';

            createCircle(ctx, x, y, 14, { color: 'white', strokeColor: '#fbbf24', strokeWidth: 2 });
            createText(ctx, x, y, content, { color, fontSize: 16 });
        };

        drawHandle(startAngle, 'start');
        drawHandle(endAngle, 'end');

        const hoursDiff = ((endAngle - startAngle + 360) % 360) / 15;
        const time = hoursToTime(hoursDiff);

        createText(ctx, centerX, centerY - 15, time, { color: '#374151', fontSize: 24, bold: true });

        createText(ctx, centerX, centerY + 15, 'Light Cycle', { color: '#6b7280', fontSize: 14 });
    }, [startAngle, endAngle]);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const handleMouseDown = (event: MouseEvent | TouchEvent) => {
            const coordinates = getCoordinatesFromEvent(event);
            const angle = getAngleFromCoordinates(coordinates, canvas);
            const handle = getClosestHandle(angle, { start: startAngle, end: endAngle });

            handleRef.current = handle;
        };

        const handleMouseMove = (event: MouseEvent | TouchEvent) => {
            if (!handleRef.current) {
                return;
            }

            const coordinates = getCoordinatesFromEvent(event);
            const angle = getAngleFromCoordinates(coordinates, canvas);

            const angles = {
                start: handleRef.current === 'start' ? angle : startAngle,
                end: handleRef.current === 'end' ? angle : endAngle,
            };

            const onTime = angleToTime(angles.start);
            const offTime = angleToTime(angles.end);

            let duration = timeToMilliseconds(offTime) - timeToMilliseconds(onTime);

            if (duration < 0) {
                duration += 24 * 60 * 60 * 1000;
            }

            onChange(onTime, duration);
        };

        const handleMouseUp = () => {
            handleRef.current = null;
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('touchstart', handleMouseDown, { passive: true });

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleMouseMove, { passive: true });

        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchend', handleMouseUp);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('touchstart', handleMouseDown);

            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleMouseMove);

            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [startAngle, endAngle, onChange]);

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-full aspect-square">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full touch-none"
                    style={{ cursor: handleRef.current ? 'grabbing' : 'grab' }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex flex-col items-center">
                        <div className="flex gap-2 items-center">
                            <div className="h-1 w-16 bg-amber-500 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
