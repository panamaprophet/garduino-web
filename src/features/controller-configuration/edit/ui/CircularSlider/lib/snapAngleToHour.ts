export const snapAngleToHour = (angle: number) => {
    const hourAngle = 15; // each hour is 360 / 24 = 15 degrees

    const snappedAngle = Math.round(angle / hourAngle) * hourAngle;

    return snappedAngle % 360;
};