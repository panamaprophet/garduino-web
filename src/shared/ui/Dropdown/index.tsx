const arrowClassList = 'after:content-["▾"] after:text-lg after:block after:absolute after:right-2.5 after:top-1/2 after:-translate-y-1/2 after:text-slate-400 after:pointer-events-none';
const selectClassList = 'block bg-slate-100 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 appearance-none cursor-pointer';

export const Dropdown = <T extends string>({ title, options, value, onChange }: { title: string, options: T[], value: T | undefined, onChange: (id: T) => void }) => {
    return (
        <div className={`relative ${arrowClassList} grow`}>
            <select
                className={selectClassList}
                value={value}
                onChange={(event) => onChange(event.target.selectedOptions[0]?.value as T)}
            >
                <option disabled value="">
                    {title}
                </option>

                {options.map((value) => (
                    <option key={value} value={value}>
                        {value}
                    </option>
                ))}
            </select>
        </div>
    );
};
