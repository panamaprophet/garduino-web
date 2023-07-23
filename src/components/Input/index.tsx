const inputClassList = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 appearance-none text-left';


export const Input = ({ type = 'text', value, onChange, readOnly = false }: { value: string | number, type: 'text' | 'number' | 'range' | 'time', onChange?: (value: string) => void, readOnly?: boolean }) => (
    <input
        type={type}
        className={inputClassList}
        value={value}
        readOnly={readOnly}
        onChange={event => onChange && onChange(event.target.value)}
    />
);

export const InputRange = ({ value, onChange }: { value: string | number, onChange: (value: number) => void }) => (
    <input
        className={`${inputClassList} !p-0`}
        value={value}
        type="range"
        max="255"
        min="0"
        step="1"
        onChange={event => onChange(Number(event.target.value))}
    />
)
