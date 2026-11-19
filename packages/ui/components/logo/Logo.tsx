import classNames from "@rondevu/ui/classNames";

// The brand is the `rOndevu` wordmark only (docs/design-system.md §2, §4); there is no square "r" mark.
// `src` is kept for callers that need a specific image (e.g. a custom-domain logo); without it the wordmark is rendered as text.
export function Logo({
  small,
  icon,
  inline = true,
  className,
  src,
}: {
  small?: boolean;
  icon?: boolean;
  inline?: boolean;
  className?: string;
  src?: string;
}) {
  if (src) {
    return (
      <span className={classNames("logo", inline ? "inline" : "block", className)}>
        <strong>
          <img
            className={classNames(
              icon ? "mx-auto w-9" : small ? "h-5 w-auto" : "h-6 w-auto sm:h-7",
              "dark:invert"
            )}
            alt="rOndevu"
            title="rOndevu"
            src={icon ? `${src}?type=icon` : src}
          />
        </strong>
      </span>
    );
  }

  return (
    <span
      className={classNames(
        "logo text-emphasis font-semibold leading-none tracking-[-0.04em] select-none",
        inline ? "inline-flex items-center" : "flex items-center",
        icon ? "justify-center text-base" : small ? "text-lg" : "text-[22px]",
        className
      )}
      title="rOndevu">
      rOndevu
    </span>
  );
}
