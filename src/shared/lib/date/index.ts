export type Time = string;

export const timeToHHmmArray = (time: Time) => time.split(':').map(Number) as [hours: number, minutes: number];

export const millisecondsToHours = (ms: number) => ms / 1000 / 60 / 60;

export const hoursToMilliseconds = (hours: number) => hours * 60 * 60 * 1000;

export const timeToMilliseconds = (time: Time) => {
    const [hours, minutes] = timeToHHmmArray(time);

    return hoursToMilliseconds(hours) + hoursToMilliseconds(minutes / 60);
};

export const millisecondsToTime = (duration: number) => {
    const hours = millisecondsToHours(duration);
    const minutes = (hours % 1 * 60) % 60;

    return [hours, minutes]
        .map((value) => Math.trunc(value))
        .map((value) => value.toString().padStart(2, '0'))
        .join(':') as Time;
};

export const getTimeRangeInHours = (time: Time, duration: number): [onTime: number, offTime: number] => {
    const [onHours, onMinutes] = timeToHHmmArray(time);
    const onTime = onHours + onMinutes / 60;

    let offTime = onTime + millisecondsToHours(duration);

    if (offTime >= 24) offTime -= 24;

    return [onTime, offTime];
};

export const getTimeZoneOffset = () => (new Date()).getTimezoneOffset() / 60;

export const hoursToTime = (hours: number) => millisecondsToTime(hoursToMilliseconds(hours));

export const addHours = (time: Time, hours: number) => millisecondsToTime(timeToMilliseconds(time) + hoursToMilliseconds(hours));

export const subHours = (time: Time, hours: number) => millisecondsToTime(timeToMilliseconds(time) - hoursToMilliseconds(hours));

export const addDays = (date: Date, days: number) => {
    const dayInMilliseconds = 24 * 60 * 60 * 1000;
    const millisecondsToAdd = dayInMilliseconds * days;

    return new Date(date.valueOf() + millisecondsToAdd);
};

export const formatDate = (ts: number) => {
    const date = new Date(ts);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    // const month = (date.getMonth() + 1).toString().padStart(2, '0');
    // const day = date.getDate().toString().padStart(2, '0');

    // return `${day}.${month}.${date.getFullYear()} ${hours}:${minutes}`;
    return `${hours}:${minutes}`;
};
