"use client";

import { ArrowUpRight, Mail, MessageCircle, Phone, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { homeTranslations, type Locale, type Translations } from "../i18n/home-translations";
import { ease } from "./motion";

export interface PlanContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: "monthly" | "yearly" | null;
  locale: Locale;
  phone: string;
  email: string;
  whatsapp: string;
}

export function PlanContactModal({
  isOpen,
  onClose,
  planType,
  locale,
  phone,
  email,
  whatsapp,
}: PlanContactModalProps) {
  const t: Translations = homeTranslations[locale];
  const dialogRef = useRef<HTMLElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const plan = planType === "yearly" ? t.pricing.yearly : planType === "monthly" ? t.pricing.monthly : null;
  const cleanPhone = (phone || "").replace(/[^\d+]/g, "");
  const cleanWhatsapp = (whatsapp || "").replace(/\D/g, "");
  const prefilledWhatsappText = encodeURIComponent(t.modal.whatsappPrefill(plan?.name ?? null));

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button, a[href]");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      <motion.section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rondevu-contact-title"
        aria-describedby="rondevu-contact-description"
        tabIndex={-1}
        initial={{ opacity: 0, y: 12, scale: 0.98, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.35, ease }}
        className="relative z-10 max-h-[calc(100dvh-2rem)] w-full max-w-[460px] overflow-y-auto rounded-xl border border-border bg-popover p-6 text-popover-foreground shadow-2xl outline-none sm:p-7">
        <button
          type="button"
          onClick={onClose}
          aria-label={t.modal.close}
          className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <X className="size-4" />
        </button>

        <div className="pr-10">
          <h2 id="rondevu-contact-title" className="font-semibold text-2xl tracking-[-0.04em]">
            {t.modal.title}
          </h2>
          <p id="rondevu-contact-description" className="mt-1.5 text-muted-foreground text-sm">
            {plan ? t.modal.subtitle : t.modal.generalSubtitle}
          </p>
        </div>

        {plan && (
          <div
            data-plan-summary
            className="mt-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-border border-y py-4">
            <span className="font-medium">{plan.name}</span>
            <span className="font-mono text-sm tabular-nums">
              {plan.price} <span className="text-muted-foreground">{plan.period}</span>
            </span>
          </div>
        )}

        <div className="mt-6">
          <a
            href={`https://wa.me/${cleanWhatsapp}?text=${prefilledWhatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            data-contact-channel="primary"
            className="group flex h-11 items-center justify-between gap-3 rounded-lg bg-primary px-4 font-medium text-primary-foreground text-sm transition-[background-color,transform] duration-150 hover:bg-primary/90 active:scale-[.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <span className="flex items-center gap-3">
              <MessageCircle className="size-4" />
              {t.modal.whatsapp}
            </span>
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <div className="mt-3 divide-y divide-border">
            <a
              href={`tel:${cleanPhone}`}
              data-contact-channel="phone"
              className="flex min-h-12 items-center justify-between gap-4 py-3 text-sm transition-colors hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              <span className="flex items-center gap-3 font-medium">
                <Phone className="size-4 text-muted-foreground" />
                {t.modal.phone}
              </span>
              <span className="text-right font-mono text-muted-foreground tabular-nums">{phone}</span>
            </a>
            <a
              href={`mailto:${email}?subject=${encodeURIComponent(t.modal.emailSubject(plan?.name ?? null))}`}
              data-contact-channel="email"
              className="flex min-h-12 items-center justify-between gap-4 py-3 text-sm transition-colors hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              <span className="flex items-center gap-3 font-medium">
                <Mail className="size-4 text-muted-foreground" />
                {t.modal.email}
              </span>
              <span className="break-all text-right text-muted-foreground">{email}</span>
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
