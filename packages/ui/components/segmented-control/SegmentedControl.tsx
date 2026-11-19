import classNames from "@rondevu/ui/classNames";

export type SegmentedControlData<T extends string> = T | { value: T; label: string };

export interface SegmentedControlProps<T extends string> {
    data: SegmentedControlData<T>[];
    value: T;
    onChange: (value: T) => void;
    disabled?: boolean;
    className?: string;
    "data-testid"?: string;
}

const SegmentedControl = function <T extends string>({
    data,
    value,
    onChange,
    disabled = false,
    className,
    "data-testid": dataTestId,
    ...props
}: SegmentedControlProps<T>) {
    const handleChange = (newValue: T) => {
        if (!disabled) {
            onChange(newValue);
        }
    };

    return (
        <div
            className={classNames("max-w-full", className)}
            data-testid={dataTestId}
            {...props}>
            <div
                className="no-scrollbar flex gap-0.5 overflow-x-scroll rounded-lg bg-subtle p-[3px]"
                role="radiogroup">
                {data.map((item, idx) => {
                    const itemValue = typeof item === "string" ? item : item.value;
                    const itemLabel = typeof item === "string" ? item : item.label;
                    const isActive = value === itemValue;
                    const inputId = `segmented-control-${itemValue}-${idx}`;

                    return (
                        <label
                            key={itemValue}
                            htmlFor={inputId}
                            className={classNames(
                                "inline-flex h-7 w-full items-center justify-center whitespace-nowrap rounded-md px-2.5 text-sm font-medium leading-none transition-colors duration-160 md:mb-0",
                                "has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50",
                                isActive
                                    ? "bg-default text-emphasis shadow-sm dark:ring-1 dark:ring-inset dark:ring-default"
                                    : "text-subtle hover:text-emphasis",
                                disabled ? "pointer-events-none opacity-30" : "cursor-pointer"
                            )}>
                            <input
                                type="radio"
                                id={inputId}
                                value={itemValue}
                                checked={isActive}
                                onChange={() => handleChange(itemValue)}
                                disabled={disabled}
                                className="sr-only"
                                aria-checked={isActive}
                            />
                            <span>{itemLabel}</span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
};

export default SegmentedControl;
