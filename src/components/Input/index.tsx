const inputClassList = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 appearance-none text-left';


export const Input = <T extends string | number>({ type = 'text', value, onChange, readOnly = false }: { value: T, type: 'text' | 'number' | 'range' | 'time', onChange?: (value: T) => void, readOnly?: boolean }) => (
    <input
        type={type}
        className={inputClassList}
        value={value}
        readOnly={readOnly}
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
