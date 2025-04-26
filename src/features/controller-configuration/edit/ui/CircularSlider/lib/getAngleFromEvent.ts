import { snapAngleToHour } from "./snapAngleToHour";

export const getAngleFromEvent = (event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const isTouch = 'touches' in event;

    const clientX = isTouch ? event.touches[0]?.clientX : event.clientX;
    const clientY = isTouch ? event.touches[0]?.clientY : event.clientY;

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