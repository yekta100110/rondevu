import classNames from "@rondevu/ui/classNames";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={classNames("font-semibold text-[22px] text-foreground tracking-[-0.04em]", className)}>
      rOndevu
    </span>
  );
}
