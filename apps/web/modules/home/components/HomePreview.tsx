"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BellIcon,
  CalendarCheckIcon,
  CalendarDaysIcon,
  ClockIcon,
  LayoutListIcon,
  MessageCircleIcon,
  PlusIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { DemoAppointment, HomeContent } from "../home-content";
import { Wordmark } from "./BrandLogo";
import { CountUp, ease } from "./motion";

const T0 = 540;
const T1 = 1110;
const PX = 64 / 60;
const SIDEBAR_ICONS = [CalendarDaysIcon, LayoutListIcon, ClockIcon, UsersIcon, SettingsIcon] as const;
const NOTE_ICONS = [CalendarCheckIcon, MessageCircleIcon, BellIcon] as const;

export const fmtMinutes = (m: number) =>
  `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export function StatusBadge({ status, label }: { status: DemoAppointment["status"]; label: string }) {
  return (
    <span
      className={`inline-flex h-5 items-center gap-1.5 rounded-md border border-border px-1.5 font-mono text-[11px] ${
        status === "done" ? "text-muted-foreground" : "text-foreground"
      }`}>
      <span
        className={`size-1.5 rounded-full ${
          status === "confirmed" ? "bg-foreground" : status === "done" ? "bg-muted-foreground" : "ring-1 ring-foreground"
        }`}
      />
      {label}
    </span>
  );
}

function useNowMinute() {
  const [m, setM] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setM(d.getHours() * 60 + d.getMinutes());
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  return m;
}

function Timeline({
  items,
  selected,
  onSelect,
}: {
  items: DemoAppointment[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  const now = useNowMinute();
  const nowTop = now === null || now < T0 || now > T1 ? null : 12 + (now - T0) * PX;
  const hours: number[] = [];
  for (let m = T0; m <= T1 - 30; m += 60) hours.push(m);
  return (
    <div className="relative pr-3 pb-3 pl-16" style={{ height: 24 + (T1 - T0) * PX }}>
      {hours.map((m) => (
        <div key={m} className="absolute inset-x-0 border-border border-t" style={{ top: 12 + (m - T0) * PX, left: 64 }}>
          <span className="absolute -top-2 -left-14 font-mono text-[11px] text-muted-foreground tabular-nums">
            {fmtMinutes(m)}
          </span>
        </div>
      ))}
      {items.map((a, i) => {
        const on = a.id === selected;
        return (
          <motion.button
            key={a.id}
            type="button"
            tabIndex={-1}
            disabled={a.block}
            onClick={() => onSelect(a.id)}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease, delay: 0.1 + i * 0.07 }}
            className={`group/ev absolute right-3 left-[68px] z-[1] flex items-center gap-3 overflow-hidden rounded-lg border pr-3 pl-4 text-left transition-[border-color,background-color] duration-200 ${
              a.block
                ? "cursor-default border-border border-dashed bg-[repeating-linear-gradient(-45deg,var(--muted)_0_6px,transparent_6px_12px)] text-muted-foreground"
                : on
                  ? "border-foreground bg-accent"
                  : "border-border bg-card hover:border-foreground/30 hover:bg-accent"
            }`}
            style={{ top: 12 + (a.start - T0) * PX + 2, height: (a.end - a.start) * PX - 4 }}>
            <span
              className={`absolute inset-y-2 left-1.5 w-[3px] rounded-full transition-colors ${
                on ? "bg-foreground" : a.block ? "bg-transparent" : "bg-border group-hover/ev:bg-foreground/40"
              }`}
            />
            <span className="min-w-0 flex-1 truncate text-[13px] leading-none">
              <span className="font-medium">{a.client}</span>
              {a.service && <span className="text-muted-foreground"> · {a.service}</span>}
            </span>
            <span className="hidden shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums sm:inline">
              {fmtMinutes(a.start)} – {fmtMinutes(a.end)}
            </span>
          </motion.button>
        );
      })}
      {nowTop !== null && now !== null && (
        <motion.div
          className="pointer-events-none absolute right-3 left-14 h-0 border-foreground border-t"
          animate={{ top: nowTop }}
          transition={{ duration: 1, ease: "linear" }}>
          <span className="absolute -top-[3.5px] -left-[3px] size-1.5 rounded-full bg-foreground" />
          <span className="absolute -top-2 -left-[54px] bg-background px-1 font-medium font-mono text-[11px] tabular-nums">
            {fmtMinutes(now)}
          </span>
        </motion.div>
      )}
    </div>
  );
}

function PanelBody({ content, dateLabel }: { content: HomeContent["preview"]; dateLabel: string }) {
  const [selected, setSelected] = useState("a3");
  const appointment = content.appointments.find((a) => a.id === selected) ?? content.appointments[0];
  const f = content.statFormats;
  const stats = [
    { to: 5, format: (v: number) => `${v} ${f.bookings}` },
    { to: 225, format: (v: number) => `${Math.floor(v / 60)} ${f.hours} ${String(v % 60).padStart(2, "0")} ${f.minutes}` },
    { to: 82, format: (v: number) => `%${v}` },
    { to: 37, format: (v: number) => String(v) },
  ];
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-semibold text-2xl tracking-tight">{content.today}</p>
          <p className="min-h-5 text-muted-foreground text-sm">{dateLabel}</p>
        </div>
        <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 font-medium text-primary-foreground text-sm">
          <PlusIcon className="size-4" />
          {content.newBooking}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {content.stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="grid gap-1 rounded-xl border border-border bg-card px-4 py-3"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease, delay: i * 0.06 }}>
            <span className="text-muted-foreground text-sm">{s.label}</span>
            <CountUp
              to={stats[i].to}
              format={stats[i].format}
              className="font-medium text-xl tabular-nums tracking-tight sm:text-2xl"
            />
            <span className="truncate text-muted-foreground text-xs">{s.sub}</span>
          </motion.div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-border border-b px-4 py-3">
            <span className="font-medium text-sm">{content.timeline}</span>
            <span className="font-mono text-muted-foreground text-xs">09:00 – 18:30</span>
          </div>
          <Timeline items={content.appointments} selected={selected} onSelect={setSelected} />
        </div>
        <div className="hidden rounded-xl border border-border bg-card p-4 lg:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={appointment.id}
              className="grid gap-4"
              initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
              transition={{ duration: 0.25, ease }}>
              <div>
                <StatusBadge status={appointment.status} label={content.status[appointment.status]} />
              </div>
              <div>
                <p className="font-medium text-lg tracking-tight">{appointment.client}</p>
                <p className="text-muted-foreground text-sm">{appointment.service}</p>
              </div>
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 border-border border-t pt-4 text-sm">
                <dt className="text-muted-foreground">{content.time}</dt>
                <dd className="font-mono tabular-nums">
                  {fmtMinutes(appointment.start)} – {fmtMinutes(appointment.end)}
                </dd>
                <dt className="text-muted-foreground">{content.duration}</dt>
                <dd>
                  {appointment.end - appointment.start} {content.minutes}
                </dd>
              </dl>
              <p className="rounded-md border border-border bg-muted/50 px-3 py-2.5 text-sm">{appointment.note}</p>
              <div className="flex flex-wrap gap-2">
                {appointment.status === "pending" && (
                  <span className="inline-flex h-7 items-center rounded-md bg-primary px-2.5 font-medium text-primary-foreground text-xs">
                    {content.confirm}
                  </span>
                )}
                <span className="inline-flex h-7 items-center rounded-md border border-border px-2.5 font-medium text-xs">
                  {content.reschedule}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Notifications({ items, now }: { items: HomeContent["preview"]["notifications"]; now: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((x) => (x + 1) % items.length), 3400);
    return () => clearInterval(id);
  }, [items.length]);
  const note = items[i];
  const Icon = NOTE_ICONS[i % NOTE_ICONS.length];
  return (
    <div
      className="pointer-events-none absolute -right-2 -bottom-6 z-10 w-[272px] sm:-right-6 sm:bottom-10"
      aria-live="polite">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16, scale: 0.96, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, scale: 0.98, filter: "blur(4px)" }}
          transition={{ duration: 0.5, ease }}
          className="flex items-center gap-3 rounded-xl border border-border bg-popover/90 p-3 shadow-xl backdrop-blur-xl">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-foreground text-background">
            <Icon className="size-4" />
          </span>
          <span className="min-w-0">
            <span className="block font-medium text-sm">{note.title}</span>
            <span className="block truncate text-muted-foreground text-xs tabular-nums">{note.body}</span>
          </span>
          <span className="ml-auto self-start font-mono text-[10px] text-muted-foreground">{now}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Static sample data only: the landing page must never read real accounts. */
export function HomePreview({ content, locale }: { content: HomeContent["preview"]; locale: "tr" | "en" }) {
  const [dateLabel, setDateLabel] = useState("");
  useEffect(() => {
    setDateLabel(
      new Date().toLocaleDateString(locale === "tr" ? "tr-TR" : "en-GB", {
        day: "numeric",
        month: "long",
        weekday: "long",
      })
    );
  }, [locale]);

  return (
    <figure aria-label={content.caption} className="relative">
      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-[0_40px_120px_-40px_rgba(0,0,0,0.35)] dark:shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
        <div className="flex items-center border-border border-b px-4 py-2.5">
          <span className="flex gap-1.5" aria-hidden="true">
            <i className="size-2.5 rounded-full bg-border" />
            <i className="size-2.5 rounded-full bg-border" />
            <i className="size-2.5 rounded-full bg-border" />
          </span>
          <span className="mx-auto rounded-md border border-border px-3 py-0.5 font-mono text-[11px] text-muted-foreground">
            {content.url}
          </span>
          <span className="w-[42px]" />
        </div>
        <div className="flex">
          <aside className="hidden w-52 shrink-0 flex-col gap-1 border-border border-r bg-sidebar p-3 md:flex" aria-hidden="true">
            <div className="mb-3 px-2 py-1">
              <Wordmark className="text-lg" />
            </div>
            {content.sidebar.map((label, i) => {
              const Icon = SIDEBAR_ICONS[i] ?? CalendarDaysIcon;
              return (
                <div
                  key={label}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                    i === 0 ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground" : "text-muted-foreground"
                  }`}>
                  <Icon className="size-4" />
                  {label}
                </div>
              );
            })}
          </aside>
          <div className="min-w-0 flex-1 p-4 md:p-6">
            <PanelBody content={content} dateLabel={dateLabel} />
          </div>
        </div>
      </div>
      <Notifications items={content.notifications} now={content.now} />
      <figcaption className="sr-only">{content.caption}</figcaption>
    </figure>
  );
}
