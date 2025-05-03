interface Props {
    checked?: boolean;
    disabled?: boolean;
    onChange: () => void;
}

const classList = `
appearance-none relative w-4 h-4 rounded border border-gray-300 bg-white transition-all duration-200 flex items-center justify-center
before:content-[''] before:absolute before:inset-0 before:rounded
after:content-[''] after:-mt-0.5 after:h-2 after:w-1 after:rotate-45 after:border-r-2 after:border-b-2 after:border-white after:opacity-0
checked:bg-current checked:border-transparent checked:after:opacity-100
disabled:opacity-50 disabled:cursor-not-allowed
`;

export const Checkbox = ({ checked, disabled, onChange }: Props) => {
    return (
        <input
            type="checkbox"
            className={classList}
            onChange={onChange}
            checked={checked}
            disabled={disabled}
        />
    )
}
