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
}