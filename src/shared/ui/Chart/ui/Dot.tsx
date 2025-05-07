export const Dot = ({ value, left, bottom, color = 'black' }: { left: number; bottom: number; value: unknown; color?: string }) => (
    <span
        className={`group hover:z-40 absolute -translate-x-1/2 translate-y-1/2 p-4`}
        style={{
            bottom: `${bottom}%`,
            left: `${left}%`,
            color: color,
        }}
    >
        <div className={`
            -translate-y-1/2
            -translate-x-1/2
            absolute
            w-1.5
            h-1.5
            rounded-full
            border-2
            border-current
            bg-white
        `} />

        <div className="
            absolute
            px-1
            transition-opacity
            text-xs
            text-gray-600
            text-current
            whitespace-nowrap

            -translate-x-1/2
            -translate-y-[150%]

            pointer-events-none

            shadow
            rounded
            bg-white
            z-[1000]
        " style={{ color }}>
            {String(value)}
        </div>
    </span>
);
