"use client";

import { useLocale } from "@rondevu/lib/hooks/useLocale";
import classNames from "@rondevu/ui/classNames";
import { Tooltip } from "@rondevu/ui/components/tooltip";
import { Kbd } from "@coss/ui/components/kbd";
import { MoonIcon, SunIcon } from "@coss/ui/icons";
import { useTheme } from "next-themes";
import { useCallback, useEffect } from "react";

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

export function ThemeToggle({ className }: { className?: string }) {
  const { t } = useLocale();
  const { resolvedTheme, setTheme } = useTheme();

  const toggle = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "d") return;
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
      if (isTypingTarget(event.target)) return;
      // Ignore the shortcut while a dialog, menu or command palette is open on top of the shell.
      if (document.querySelector("[role='dialog'], [role='menu'], [role='listbox']")) return;
      toggle();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  return (
    <Tooltip
      side="bottom"
      content={
        <span className="inline-flex items-center gap-2">
          {t("shell_theme")} <Kbd>D</Kbd>
        </span>
      }>
      <button
        type="button"
        aria-label={t("shell_toggle_theme")}
        onClick={toggle}
        className={classNames(
          "relative flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground",
          className
        )}>
        <SunIcon className="size-4 rotate-0 scale-100 transition-transform duration-500 dark:-rotate-90 dark:scale-0" />
        <MoonIcon className="absolute size-4 rotate-90 scale-0 transition-transform duration-500 dark:rotate-0 dark:scale-100" />
      </button>
    </Tooltip>
  );
}
