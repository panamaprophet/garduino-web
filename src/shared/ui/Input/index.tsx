import { HTMLInputTypeAttribute } from 'react';

const commonClassList = 'bg-slate-100 inset-shadow-2xs rounded-lg outline-none w-full border-none accent-emerald-500 outline-none cursor-pointer appearance-none';
const focusClassList = 'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500';

const inputClassList = `${commonClassList} ${focusClassList} text-slate-800 text-sm block w-full p-2.5 text-left font-normal`;
const rangeClassList = `${commonClassList}`;

interface Props<T,> {
    value: T;
    type?: HTMLInputTypeAttribute;
    onChange?: (value: T) => void;
    readOnly?: boolean;
    placeholder?: string;
    autoComplete?: string;
}


export const Input = <T extends string | number>({ type = 'text', value, onChange, readOnly = false, placeholder, autoComplete }: Props<T>) => (
    <input
        type={type}
        className={inputClassList}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={event => onChange && onChange(event.target.value as T)}
        autoComplete={autoComplete}
    />
);

export const InputRange = ({ value, onChange }: { value: number, onChange: (value: number) => void }) => (
    <input
        className={rangeClassList}
        value={value}
        type="range"
        max="100"
        min="0"
        step="1"
        onChange={event => onChange(Number(event.target.value))}
    />
)
