import { bookerEase, bookerPillSpring } from "@rondevu/features/bookings/Booker/utils/motion";
import { useLocale } from "@rondevu/lib/hooks/useLocale";
import classNames from "@rondevu/ui/classNames";
import { CheckIcon } from "@coss/ui/icons";
import { m } from "framer-motion";

// The service (event type) is already chosen when the booker opens, so the flow always starts at "time".
const STEP_KEYS = ["booker_step_service", "booker_step_time", "booker_step_details"] as const;

export const BookerStepper = ({ isBooking, className }: { isBooking: boolean; className?: string }) => {
  const { t } = useLocale();
  const current = isBooking ? 2 : 1;

  return (
    <ol
      className={classNames("flex items-center gap-2 text-sm", className)}
      aria-label={t("booker_steps_label")}
      data-testid="booker-stepper">
      {STEP_KEYS.map((key, i) => {
        const isCurrent = i === current;
        const isDone = i < current;
        return (
          <li key={key} className="flex items-center gap-2" aria-current={isCurrent ? "step" : undefined}>
            <span
              className={classNames(
                "relative grid size-6 place-items-center rounded-full border font-mono text-[11px] transition-colors duration-300",
                i <= current ? "border-brand-default" : "border-subtle text-subtle",
                isCurrent ? "text-brand" : isDone && "text-emphasis"
              )}>
              {isCurrent && (
                <m.span
                  layoutId="booker-step-pill"
                  className="bg-brand-default absolute inset-0 rounded-full"
                  transition={bookerPillSpring}
                />
              )}
              <span className="relative">{isDone ? <CheckIcon className="size-3" /> : i + 1}</span>
            </span>
            <span
              className={classNames(
                "hidden sm:inline",
                isCurrent ? "text-emphasis font-medium" : "text-subtle"
              )}>
              {t(key)}
            </span>
            {i < STEP_KEYS.length - 1 && (
              <span className="bg-subtle relative h-px w-6 overflow-hidden sm:w-10" aria-hidden>
                <m.span
                  className="bg-brand-default absolute inset-0 origin-left"
                  initial={false}
                  animate={{ scaleX: i < current ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [...bookerEase] }}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
};
