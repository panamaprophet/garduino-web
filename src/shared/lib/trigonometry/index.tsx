export const angleToCoords = (angle: number, radius: number, centerX: number, centerY: number) => {
    const radians = (angle - 90) * (Math.PI / 180);

    return {
        x: centerX + radius * Math.cos(radians),
        y: centerY + radius * Math.sin(radians),
    }
};

export const angleToTime = (angle: number) => {
    const totalHours = (angle / 360) * 24;
    const hours = Math.floor(totalHours);
    const minutes = Math.floor((totalHours - hours) * 60);

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

export const snapAngleToHour = (angle: number) => {
    const hourAngle = 15; // each hour is 360 / 24 = 15 degrees

    const snappedAngle = Math.round(angle / hourAngle) * hourAngle;

    return snappedAngle % 360;
};

export const getAngleFromCoordinates = (coordinates: { x: number; y: number }, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const clientX = coordinates.x;
    const clientY = coordinates.y;

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
};

export const getClosestHandle = (angle: number, angles: { start: number; end: number }) => {
    const startDiff = Math.min(
        Math.abs(angle - angles.start),
        Math.abs(angle - angles.start + 360),
        Math.abs(angle - angles.start - 360),
    );

    const endDiff = Math.min(
        Math.abs(angle - angles.end),
        Math.abs(angle - angles.end + 360),
        Math.abs(angle - angles.end - 360),
    );

    return startDiff < endDiff ? 'start' : 'end';
};

export const timeToAngle = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);

    if (typeof hours !== 'number' || typeof minutes !== 'number') {
        return 0;
    }

    return ((hours + minutes / 60) / 24) * 360
};
