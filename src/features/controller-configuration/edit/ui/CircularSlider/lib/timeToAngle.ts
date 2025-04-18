export const timeToAngle = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);

    if (typeof hours !== 'number' || typeof minutes !== 'number') {
        return 0;
    }

    return ((hours + minutes / 60) / 24) * 360
}