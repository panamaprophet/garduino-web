export type Time = string;

export type Instant = number | string;

export const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

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

export const shiftTime = (time: Time, milliseconds: number) => {
    const shifted = (timeToMilliseconds(time) + milliseconds) % DAY_IN_MILLISECONDS;

    return millisecondsToTime(shifted < 0 ? shifted + DAY_IN_MILLISECONDS : shifted);
};

const getTimezoneOffsetInMilliseconds = () => new Date().getTimezoneOffset() * 60 * 1000;

export const utcToLocalTime = (time: Time) => shiftTime(time, -getTimezoneOffsetInMilliseconds());

export const localToUtcTime = (time: Time) => shiftTime(time, getTimezoneOffsetInMilliseconds());

export const formatTime = (ts: Instant) => {
    const date = new Date(ts);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
};

const formatDayAndMonth = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    return `${day}.${month}`;
};

export const formatDate = (ts: Instant) => {
    const date = new Date(ts);

    return `${formatDayAndMonth(date)}.${date.getFullYear()} ${formatTime(ts)}`;
};

export const formatDayTime = (ts: Instant) => `${formatDayAndMonth(new Date(ts))} ${formatTime(ts)}`;

export const formatTimeAgo = (ts: Instant, now = Date.now()) => {
    const seconds = Math.max(0, Math.round((now - new Date(ts).getTime()) / 1000));

    if (seconds < 60) {
        return 'just now';
    }

    const minutes = Math.round(seconds / 60);

    if (minutes < 60) {
        return `${minutes} min ago`;
    }

    const hours = Math.round(minutes / 60);

    if (hours < 24) {
        return `${hours} h ago`;
    }

    return formatDate(ts);
};
