import { hoursToTime } from '@/shared/lib/date';
import { useRef, useEffect, useState } from 'react';

interface CircularSliderProps {
    startAngle: number
    endAngle: number
    onChange: (start: number, end: number) => void
}

const snapAngleToHour = (angle: number) => {
    const hourAngle = 15; // each hour is 360 / 24 = 15 degrees

    const snappedAngle = Math.round(angle / hourAngle) * hourAngle;

    return snappedAngle % 360;
};

const getAngleFromEvent = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    let clientX, clientY

    if ("touches" in e) {
        clientX = e.touches[0]?.clientX
        clientY = e.touches[0]?.clientY
    } else {
        clientX = e.clientX
        clientY = e.clientY
    }

    if (!clientX || !clientY) {
        console.log('unable to calculate the coordinates', { clientX, clientY });
        return 0;
    }

    const x = clientX - rect.left - centerX
    const y = clientY - rect.top - centerY

    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90
    if (angle < 0) angle += 360

    // return angle
    return snapAngleToHour(angle);
}

const angleToCoords = (angle: number, radius: number, centerX: number, centerY: number) => {
    const radians = (angle - 90) * (Math.PI / 180);

    return {
        x: centerX + radius * Math.cos(radians),
        y: centerY + radius * Math.sin(radians),
    }
}

export function CircularSlider({ startAngle, endAngle, onChange }: CircularSliderProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [dragging, setDragging] = useState<'start' | 'end' | null>(null)
    const [angles, setAngles] = useState({ start: startAngle, end: endAngle })

    // const angles = { start: startAngle, end: endAngle };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        if (!canvas || !ctx) {
            return;
        }

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = rect.height;

        const centerX = width / 2;
        const centerY = height / 2;

        const radius = Math.min(width, height) / 2 - 40;

        ctx.clearRect(0, 0, width, height);

        // Draw background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "#f3f4f6";
        ctx.fill();

        // Draw time markers
        for (let hour = 0; hour < 24; hour++) {
            const angle = hour * 15 - 90
            const radians = angle * (Math.PI / 180)
            const isMainMarker = hour % 6 === 0

            const innerRadius = isMainMarker ? radius - 15 : radius - 10
            const outerRadius = radius - 2

            const innerX = centerX + innerRadius * Math.cos(radians)
            const innerY = centerY + innerRadius * Math.sin(radians)
            const outerX = centerX + outerRadius * Math.cos(radians)
            const outerY = centerY + outerRadius * Math.sin(radians)

            ctx.beginPath()
            ctx.moveTo(innerX, innerY)
            ctx.lineTo(outerX, outerY)
            ctx.strokeStyle = isMainMarker ? "#6b7280" : "#d1d5db"
            ctx.lineWidth = isMainMarker ? 2 : 1
            ctx.stroke()

            if (isMainMarker) {
                const textRadius = radius + ([6, 18].includes(hour) ? 20 : 10)
                const textX = centerX + textRadius * Math.cos(radians)
                const textY = centerY + textRadius * Math.sin(radians)

                ctx.font = "12px sans-serif"
                ctx.fillStyle = "#6b7280"
                ctx.textAlign = "center"
                ctx.textBaseline = "middle"
                ctx.fillText(`${hour}:00`, textX, textY)
            }
        }

        // Draw active arc
        const startRad = (angles.start - 90) * (Math.PI / 180)
        const endRad = (angles.end - 90) * (Math.PI / 180)

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius - 20, startRad, endRad)
        ctx.lineWidth = 30
        ctx.strokeStyle = "rgba(251,191,36, 0.8)"
        ctx.stroke()

        // Draw handles
        const drawHandle = (angle: number, icon: "sun" | "moon") => {
            const { x, y } = angleToCoords(angle, radius - 20, centerX, centerY)

            // Draw handle circle
            ctx.beginPath()
            ctx.arc(x, y, 14, 0, 2 * Math.PI)
            ctx.fillStyle = "white"
            ctx.fill()
            ctx.strokeStyle = "#fbbf24"
            ctx.lineWidth = 2
            ctx.stroke()

            // Draw icon
            ctx.fillStyle = icon === "sun" ? "rgba(245,158,11,0.8)" : "rgba(107,114,128,0.8)"
            ctx.font = "12px sans-serif"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText(icon === "sun" ? "☀️" : "🌙", x, y)
        }

        drawHandle(angles.start, "sun")
        drawHandle(angles.end, "moon")

        // Draw center info
        const hoursDiff = ((angles.end - angles.start + 360) % 360) / 15
        const time = hoursToTime(hoursDiff);

        ctx.font = "bold 24px sans-serif"
        ctx.fillStyle = "#374151"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        ctx.fillText(time, centerX, centerY - 15)

        ctx.font = "14px sans-serif"
        ctx.fillStyle = "#6b7280"
        ctx.fillText("Light Cycle", centerX, centerY + 15)
    }, [angles])

    // Handle mouse/touch events
    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) return

        const getClosestHandle = (angle: number) => {
            const startDiff = Math.min(
                Math.abs(angle - angles.start),
                Math.abs(angle - angles.start + 360),
                Math.abs(angle - angles.start - 360),
            )

            const endDiff = Math.min(
                Math.abs(angle - angles.end),
                Math.abs(angle - angles.end + 360),
                Math.abs(angle - angles.end - 360),
            )

            return startDiff < endDiff ? "start" : "end"
        }

        const handleMouseDown = (e: MouseEvent | TouchEvent) => {
            const angle = getAngleFromEvent(e, canvas)
            setDragging(getClosestHandle(angle))
        }

        const handleMouseMove = (e: MouseEvent | TouchEvent) => {
            if (!dragging) {
                return
            }

            const angle = getAngleFromEvent(e, canvas);

            setAngles((prev) => ({ ...prev, [dragging]: angle }));
        }

        const handleMouseUp = () => {
            if (dragging) {
                onChange(angles.start, angles.end)
                setDragging(null)
            }
        }

        canvas.addEventListener("mousedown", handleMouseDown)
        canvas.addEventListener("touchstart", handleMouseDown, { passive: true })
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("touchmove", handleMouseMove, { passive: true })
        window.addEventListener("mouseup", handleMouseUp)
        window.addEventListener("touchend", handleMouseUp)

        return () => {
            canvas.removeEventListener("mousedown", handleMouseDown)
            canvas.removeEventListener("touchstart", handleMouseDown)
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("touchmove", handleMouseMove)
            window.removeEventListener("mouseup", handleMouseUp)
            window.removeEventListener("touchend", handleMouseUp)
        }
    }, [dragging, angles, onChange])

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-full aspect-square">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full touch-none"
                    style={{ cursor: dragging ? "grabbing" : "grab" }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex flex-col items-center">
                        <div className="flex gap-2 items-center">
                            <div className="h-1 w-16 bg-[rgba(245,158,11,0.8)] rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
