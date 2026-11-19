"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, ClockIcon, MapPinIcon } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import type { HomeContent } from "../home-content";
import { fmtMinutes } from "./HomePreview";
import { outlineButtonClass, primaryButtonClass } from "./MarketingHeader";
import { ease } from "./motion";

const BASE_SLOTS = [540, 585, 630, 675, 780, 825, 870, 915, 960, 1050, 1095];
const CLOSE = 1170;
const PHONE_RE = /^(\+?90)?0?5\d{9}$/;

const pane = {
  initial: { opacity: 0, x: 16, filter: "blur(4px)" },
  animate: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: { opacity: 0, x: -16, filter: "blur(4px)" },
  transition: { duration: 0.35, ease },
};

/** Deterministic fake availability so the demo looks lived-in without touching real data. */
function slotsFor(date: Date, duration: number, now: Date) {
  if (date.getDay() === 0) return [];
  const isToday = date.toDateString() === now.toDateString();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const seed = date.getDate() + date.getMonth() * 31;
  return BASE_SLOTS.filter((m, j) => {
    if (m + duration > CLOSE) return false;
    if (isToday) return m > nowMin + 30;
    return (seed * 5 + j * 3) % 4 !== 0;
  });
}

function Stepper({ steps, step }: { steps: string[]; step: number }) {
  return (
    <ol className="flex items-center gap-2 text-sm">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <span
            className={`relative grid size-6 place-items-center rounded-full border font-mono text-[11px] transition-colors duration-300 ${
              i <= step ? "border-foreground" : "border-border text-muted-foreground"
            } ${i === step ? "text-background" : ""}`}>
            {i === step && <motion.span layoutId="demo-step" className="absolute inset-0 rounded-full bg-foreground" />}
            <span className="relative">{i < step ? <CheckIcon className="size-3" /> : i + 1}</span>
          </span>
          <span className={`hidden sm:inline ${i === step ? "font-medium text-foreground" : "text-muted-foreground"}`}>
            {s}
          </span>
          {i < steps.length - 1 && (
            <span className="relative h-px w-6 overflow-hidden bg-border sm:w-10">
              <motion.span
                className="absolute inset-0 origin-left bg-foreground"
                animate={{ scaleX: i < step ? 1 : 0 }}
                transition={{ duration: 0.5, ease }}
              />
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

export function BookingDemo({ content, locale }: { content: HomeContent["booking"]; locale: "tr" | "en" }) {
  const dateLocale = locale === "tr" ? "tr-TR" : "en-GB";
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState(content.services[0].id);
  const [days, setDays] = useState<Date[]>([]);
  const [now, setNow] = useState<Date | null>(null);
  const [day, setDay] = useState<Date | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState(false);

  // Dates are built on the client so server and browser render the same markup.
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const list: Date[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      list.push(d);
    }
    setNow(new Date());
    setDays(list);
    setDay(list.find((d) => d.getDay() !== 0) ?? list[0]);
  }, []);

  const service = content.services.find((s) => s.id === serviceId) ?? content.services[0];
  const slots = useMemo(
    () => (day && now ? slotsFor(day, service.duration, now) : []),
    [day, now, service.duration]
  );
  const phoneBad = !PHONE_RE.test(phone.replace(/[\s()-]/g, ""));
  const nameBad = name.trim().length < 2;
  const when =
    day && time !== null
      ? `${day.toLocaleDateString(dateLocale, { day: "numeric", month: "long", weekday: "long" })} · ${fmtMinutes(
          time
        )} – ${fmtMinutes(time + service.duration)}`
      : "";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (!phoneBad && !nameBad) setDone(true);
  };

  const reset = () => {
    setDone(false);
    setStep(0);
    setTime(null);
    setName("");
    setPhone("");
    setTried(false);
  };

  return (
    <div className="grid w-full gap-6">
      <div className="flex items-center gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-foreground font-medium text-background text-sm">
          {content.host.initials}
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-xl tracking-tight">{content.host.name}</p>
          <p className="text-muted-foreground text-sm">{content.host.role}</p>
        </div>
      </div>

      {!done && <Stepper steps={content.steps} step={step} />}

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.div
              key="done"
              className="grid justify-items-start gap-5 p-6 sm:p-8"
              initial={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.5, ease }}>
              <svg viewBox="0 0 48 48" className="size-12" aria-hidden="true">
                <motion.circle
                  cx="24"
                  cy="24"
                  r="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease }}
                  style={{ rotate: -90, transformOrigin: "center" }}
                />
                <motion.path
                  d="M15 24.5l6 6 12-13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, ease, delay: 0.6 }}
                />
              </svg>
              <div>
                <p className="font-semibold text-2xl tracking-tight">{content.doneTitle}</p>
                <p className="text-muted-foreground">{content.doneBody}</p>
              </div>
              <dl className="grid w-full grid-cols-[auto_1fr] gap-x-8 gap-y-2 border-border border-t pt-5 text-sm">
                <dt className="text-muted-foreground">{content.doneService}</dt>
                <dd>{service.name}</dd>
                <dt className="text-muted-foreground">{content.doneTime}</dt>
                <dd className="tabular-nums">{when}</dd>
                <dt className="text-muted-foreground">{content.doneWhere}</dt>
                <dd>{service.where}</dd>
              </dl>
              <button type="button" onClick={reset} className={outlineButtonClass}>
                {content.again}
              </button>
            </motion.div>
          ) : step === 0 ? (
            <motion.div key="s0" {...pane} className="grid gap-2 p-4 sm:p-6">
              <LayoutGroup>
                {content.services.map((s) => {
                  const on = s.id === serviceId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setServiceId(s.id);
                        setTime(null);
                      }}
                      aria-pressed={on}
                      className={`relative flex items-center gap-4 rounded-lg border px-4 py-4 text-left transition-colors duration-150 ${
                        on ? "border-foreground" : "border-border hover:border-foreground/30"
                      }`}>
                      <span className="relative grid size-4 shrink-0 place-items-center rounded-full border border-foreground/60">
                        {on && <motion.span layoutId="demo-svc" className="size-2 rounded-full bg-foreground" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{s.name}</span>
                        <span className="flex flex-wrap gap-x-4 text-muted-foreground text-sm">
                          <span className="inline-flex items-center gap-1">
                            <ClockIcon className="size-3.5" />
                            {s.duration} {content.minutes}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPinIcon className="size-3.5" />
                            {s.where}
                          </span>
                        </span>
                      </span>
                      <span className="font-mono text-sm tabular-nums">{s.price}</span>
                    </button>
                  );
                })}
              </LayoutGroup>
              <div className="flex justify-end pt-2">
                <button type="button" className={primaryButtonClass} onClick={() => setStep(1)}>
                  {content.next}
                  <ArrowRightIcon className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                </button>
              </div>
            </motion.div>
          ) : step === 1 ? (
            <motion.div key="s1" {...pane} className="grid md:grid-cols-[auto_minmax(0,1fr)]">
              <div className="border-border border-b p-4 md:border-r md:border-b-0">
                <LayoutGroup>
                  <div className="grid grid-cols-7 gap-1">
                    {days.slice(0, 7).map((d) => (
                      <span key={`h-${d.getDay()}`} className="text-center font-mono text-[11px] text-muted-foreground">
                        {d.toLocaleDateString(dateLocale, { weekday: "narrow" })}
                      </span>
                    ))}
                    {days.map((d) => {
                      const on = day?.toDateString() === d.toDateString();
                      const closed = d.getDay() === 0;
                      return (
                        <button
                          key={d.toISOString()}
                          type="button"
                          disabled={closed}
                          onClick={() => {
                            setDay(d);
                            setTime(null);
                          }}
                          aria-pressed={on}
                          className={`relative grid size-10 place-items-center rounded-md font-mono text-sm tabular-nums transition-colors duration-150 ${
                            closed
                              ? "text-muted-foreground/40 line-through"
                              : on
                                ? "text-background"
                                : "hover:bg-accent"
                          }`}>
                          {on && (
                            <motion.span
                              layoutId="demo-day"
                              className="absolute inset-0 rounded-md bg-foreground"
                              transition={{ type: "spring", stiffness: 500, damping: 38 }}
                            />
                          )}
                          <span className="relative">{d.getDate()}</span>
                        </button>
                      );
                    })}
                  </div>
                </LayoutGroup>
              </div>
              <div className="grid content-start gap-3 p-4 sm:p-6">
                <p className="font-medium text-sm">
                  {day
                    ? day.toLocaleDateString(dateLocale, { day: "numeric", month: "long", weekday: "long" })
                    : content.pickDay}
                </p>
                <LayoutGroup>
                  <div className="grid grid-cols-3 gap-2">
                    <AnimatePresence mode="popLayout">
                      {slots.map((m, j) => (
                        <motion.button
                          key={`${day?.toDateString()}-${m}`}
                          type="button"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3, ease, delay: j * 0.02 }}
                          onClick={() => setTime(m)}
                          aria-pressed={time === m}
                          className={`relative h-10 rounded-md border font-mono text-sm transition-colors duration-150 ${
                            time === m ? "border-foreground text-background" : "border-border hover:border-foreground/40"
                          }`}>
                          {time === m && (
                            <motion.span
                              layoutId="demo-slot"
                              className="absolute inset-0 rounded-[5px] bg-foreground"
                              transition={{ type: "spring", stiffness: 500, damping: 38 }}
                            />
                          )}
                          <span className="relative tabular-nums">{fmtMinutes(m)}</span>
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </div>
                </LayoutGroup>
                {day && slots.length === 0 && <p className="text-muted-foreground text-sm">{content.dayFull}</p>}
                <div className="flex justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="inline-flex h-10 items-center gap-2 rounded-lg px-3 font-medium text-sm transition-colors hover:bg-accent">
                    <ArrowLeftIcon className="size-4" />
                    {content.back}
                  </button>
                  <button
                    type="button"
                    disabled={time === null}
                    onClick={() => setStep(2)}
                    className={`${primaryButtonClass} disabled:pointer-events-none disabled:opacity-50`}>
                    {content.next}
                    <ArrowRightIcon className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.form key="s2" {...pane} className="grid gap-6 p-4 sm:p-6" noValidate onSubmit={submit}>
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm">
                <span>
                  <span className="font-medium">{service.name}</span> · <span className="tabular-nums">{when}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="font-medium underline-offset-4 hover:underline">
                  {content.change}
                </button>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="grid content-start gap-2">
                  <label htmlFor="demo-name" className="font-medium text-sm">
                    {content.nameLabel}
                  </label>
                  <input
                    id="demo-name"
                    autoComplete="off"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={tried && nameBad}
                    className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive"
                  />
                </div>
                <div className="grid content-start gap-2">
                  <label htmlFor="demo-phone" className="font-medium text-sm">
                    {content.phoneLabel}
                  </label>
                  <input
                    id="demo-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="off"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    aria-invalid={tried && phoneBad}
                    aria-describedby="demo-phone-help"
                    className="h-9 rounded-lg border border-input bg-background px-3 font-mono text-sm tabular-nums outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive"
                  />
                  <p
                    id="demo-phone-help"
                    className={`text-sm ${tried && phoneBad ? "text-destructive" : "text-muted-foreground"}`}>
                    {tried && phoneBad ? content.phoneError : content.phoneHint}
                  </p>
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex h-10 items-center gap-2 rounded-lg px-3 font-medium text-sm transition-colors hover:bg-accent">
                  <ArrowLeftIcon className="size-4" />
                  {content.back}
                </button>
                <button type="submit" className={primaryButtonClass}>
                  {content.confirm}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
      <p className="text-center text-muted-foreground text-xs">{content.demoNote}</p>
    </div>
  );
}
