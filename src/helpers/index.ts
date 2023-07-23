import { Time } from '../types';


export const timeToHHmmArray = (time: Time) => time.split(':').map(Number) as [number, number];

export const millisecondsToHours = (ms: number) => ms / 1000 / 60 / 60;

export const hoursToMilliseconds = (hours: number) => hours * 60 * 60 * 1000;

export const timeToMilliseconds = (time: Time) => {
    const [start, end] = timeToHHmmArray(time);

    return hoursToMilliseconds(start) + (end / 100 * 60) * 60 * 1000;
};

export const millisecondsToTime = (duration: number) => {
    const durationHours = millisecondsToHours(duration);
    const durationMinutes = millisecondsToHours(duration) % 1 * 60;

    const hours = durationHours.toFixed().padStart(2, '0');
    const minutes = durationMinutes.toFixed().padStart(2, '0');

    return `${hours}:${minutes}` as Time;
};

export const getTimeRangeInHours = (time: Time, duration: number): [onTime: number, offTime: number] => {
    const [onHours, onMinutes] = timeToHHmmArray(time);
    const onTime = onHours + onMinutes / 60;

    let offTime = onTime + millisecondsToHours(duration);

    if (offTime >= 24) offTime -= 24;

    return [onTime, offTime];
};
