import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import classNames from "@rondevu/ui/classNames";

// Monochrome (docs/design-system.md §1): color names map to ink strength; only red keeps the error hue.
const progressBarStyles = cva("h-1.5 rounded-full transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]", {
  variants: {
    color: {
      green: "bg-inverted",
      blue: "bg-inverted/70",
      red: "bg-destructive",
      yellow: "bg-inverted/50",
      gray: "bg-muted-foreground",
    },
  },
  defaultVariants: {
    color: "gray",
  },
});

export interface ProgressBarProps extends VariantProps<typeof progressBarStyles> {
  percentageValue: number;
  label?: string;
  className?: string;
}

export function ProgressBar({ color, percentageValue, label, className }: ProgressBarProps) {
  const clampedPercentage = Math.min(100, Math.max(0, percentageValue));

  return (
    <div className={classNames("flex w-full items-center gap-3", className)}>
      <div className="bg-subtle h-1.5 flex-1 overflow-hidden rounded-full">
        <div className={progressBarStyles({ color })} style={{ width: `${clampedPercentage}%` }} />
      </div>
      {label && <span className="text-subtle font-mono text-xs tabular-nums">{label}</span>}
    </div>
  );
}
