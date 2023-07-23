export const timeToHHmmArray = (time: string) => time.split(':').map(Number) as [number, number];

export const millisecondsToHours = (ms: number) => ms / 1000 / 60 / 60;

export const hoursToMilliseconds = (hours: number) => hours * 60 * 60 * 1000;

export const timeToMilliseconds = (time: string) => {
    const [start, end] = timeToHHmmArray(time);

    return hoursToMilliseconds(start) + (end / 100 * 60) * 60 * 1000;
};

export const millisecondsToTime = (duration: number) => {
    const durationHours = millisecondsToHours(duration ?? 0);
    const durationMinutes = millisecondsToHours(duration ?? 0) % 1 * 60;

    return `${durationHours.toFixed().padStart(2, '0')}:${durationMinutes.toFixed().padStart(2, '0')}`;
};

export const getTimeByOnTimeAndDuration = (time: string, duration: number) => {
    const [onHours, onMinutes] = timeToHHmmArray(time);
    const onTime = onHours + onMinutes / 60;

    let offTime = onTime + millisecondsToHours(duration);

    if (offTime >= 24) offTime -= 24;

    return [onTime, offTime];
};
