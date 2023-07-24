const inputClassList = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 appearance-none text-left';


interface Props<T,> {
    value: T;
    type?: 'text' | 'number' | 'time' | 'password';
    onChange?: (value: T) => void;
    readOnly?: boolean;
    placeholder?: string;
}


export const Input = <T extends string | number>({ type = 'text', value, onChange, readOnly = false, placeholder }: Props<T>) => (
    <input
        type={type}
        className={inputClassList}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={event => onChange && onChange(event.target.value as T)}
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
