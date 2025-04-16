import { HTMLInputTypeAttribute } from 'react';

const inputClassList = 'bg-slate-100 text-slate-800 text-sm inset-shadow-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 appearance-none text-left font-normal';


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
        className={`${inputClassList} !p-0`}
        value={value}
        type="range"
        max="100"
        min="0"
        step="1"
        onChange={event => onChange(Number(event.target.value))}
    />
)
