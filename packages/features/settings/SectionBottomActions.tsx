import type { ReactNode } from "react";

import classNames from "@rondevu/ui/classNames";

const SectionBottomActions = ({
  align = "start",
  children,
  className,
}: {
  align?: "start" | "end";
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={classNames(
        // Floats as a save bar (docs/design-system.md §7); it steps back while the form has nothing to save.
        "sticky bottom-4 z-10 mt-4 flex items-center gap-2 rounded-xl border border-subtle bg-default/90 px-4 py-3 shadow-lg backdrop-blur-xl transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] [&:has(button[type=submit]:disabled)]:translate-y-1 [&:has(button[type=submit]:disabled)]:opacity-60",
        align === "end" && "justify-end",
        className
      )}>
      {children}
    </div>
  );
};

export default SectionBottomActions;
