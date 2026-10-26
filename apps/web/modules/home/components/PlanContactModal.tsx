"use client";

import { ArrowUpRight, Mail, MessageCircle, Phone, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { homeTranslations, type Locale, type Translations } from "../i18n/home-translations";

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
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-black/70" />

      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rondevu-contact-title"
        aria-describedby="rondevu-contact-description"
        tabIndex={-1}
        className="relative z-10 max-h-[calc(100dvh-2rem)] w-full max-w-[480px] overflow-y-auto rounded-2xl border border-[#e5e5e5] bg-white p-6 text-[#181818] shadow-2xl outline-none dark:border-white/10 dark:bg-[#181818] dark:text-[#f4f4f5] sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label={t.modal.close}
          className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-lg text-[#737373] transition hover:bg-[#f2f2f2] hover:text-[#181818] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#737373] dark:text-[#a3a3a3] dark:hover:bg-[#202020] dark:hover:text-white">
          <X className="size-5" />
        </button>

        <div className="pr-10">
          <h2 id="rondevu-contact-title" className="font-cal text-2xl font-semibold tracking-tight sm:text-3xl">
            {t.modal.title}
          </h2>
          <p
            id="rondevu-contact-description"
            className="mt-2 text-sm leading-relaxed text-[#737373] dark:text-[#a3a3a3]">
            {plan ? t.modal.subtitle : t.modal.generalSubtitle}
          </p>
        </div>

        {plan && (
          <div
            data-plan-summary
            className="mt-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-y border-[#e5e5e5] py-4 dark:border-white/10">
            <span className="font-cal text-lg font-semibold">{plan.name}</span>
            <span className="text-sm font-medium">
              {plan.price} <span className="font-normal text-[#737373] dark:text-[#a3a3a3]">{plan.period}</span>
            </span>
          </div>
        )}

        <div className="mt-6">
          <a
            href={`https://wa.me/${cleanWhatsapp}?text=${prefilledWhatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            data-contact-channel="primary"
            className="flex min-h-12 items-center justify-between gap-3 rounded-xl bg-[#202020] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#303030] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#737373] dark:bg-[#f4f4f5] dark:text-[#181818] dark:hover:bg-white">
            <span className="flex items-center gap-3">
              <MessageCircle className="size-5" />
              {t.modal.whatsapp}
            </span>
            <ArrowUpRight className="size-4" />
          </a>

          <div className="mt-3 divide-y divide-[#e5e5e5] dark:divide-white/10">
            <a
              href={`tel:${cleanPhone}`}
              data-contact-channel="phone"
              className="flex min-h-14 items-center justify-between gap-4 py-3 text-sm transition hover:text-[#555] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#737373] dark:hover:text-white">
              <span className="flex items-center gap-3 font-medium">
                <Phone className="size-4 text-[#737373] dark:text-[#a3a3a3]" />
                {t.modal.phone}
              </span>
              <span className="text-right text-[#737373] dark:text-[#a3a3a3]">{phone}</span>
            </a>
            <a
              href={`mailto:${email}?subject=${encodeURIComponent(t.modal.emailSubject(plan?.name ?? null))}`}
              data-contact-channel="email"
              className="flex min-h-14 items-center justify-between gap-4 py-3 text-sm transition hover:text-[#555] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#737373] dark:hover:text-white">
              <span className="flex items-center gap-3 font-medium">
                <Mail className="size-4 text-[#737373] dark:text-[#a3a3a3]" />
                {t.modal.email}
              </span>
              <span className="break-all text-right text-[#737373] dark:text-[#a3a3a3]">{email}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
