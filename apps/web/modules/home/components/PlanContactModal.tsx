"use client";

import classNames from "@calcom/ui/classNames";
import { Check, Mail, MessageSquare, Phone, Sparkles, X } from "lucide-react";
import { useEffect } from "react";
import { homeTranslations, type Locale, type Translations } from "../i18n/home-translations";

export interface PlanContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: "monthly" | "yearly";
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
  const isYearly = planType === "yearly";

  const planName = isYearly ? t.pricing.yearly.name : t.pricing.monthly.name;
  const planPrice = isYearly ? t.pricing.yearly.price : t.pricing.monthly.price;
  const planPeriod = isYearly ? t.pricing.yearly.period : t.pricing.monthly.period;

  const cleanPhone = (phone || "").replace(/[^\d+]/g, "");
  const cleanWhatsapp = (whatsapp || "").replace(/\D/g, "");
  const prefilledWhatsappText = encodeURIComponent(t.modal.whatsappPrefill(planName));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Arka Plan Perdesi */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Kutusu */}
      <div className="rondevu-plan-modal relative z-10 w-full overflow-hidden rounded-2xl border border-subtle bg-white p-6 text-emphasis shadow-2xl transition-all dark:bg-[#111113] sm:p-8">
        {/* Kapat Butonu */}
        <button
          type="button"
          onClick={onClose}
          aria-label={t.modal.close}
          className="absolute right-5 top-5 rounded-full p-2 text-subtle hover:bg-muted/40 hover:text-emphasis transition">
          <X className="size-5" />
        </button>

        {/* Başlık Alanı */}
        <div className="mb-6 space-y-2 pr-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-subtle bg-muted/30 px-3 py-0.5 font-mono text-[10px] text-subtle font-semibold">
            <Sparkles className="size-3" />
            <span>{t.modal.title.toUpperCase()}</span>
          </div>
          <h3 className="font-cal font-bold text-2xl sm:text-3xl text-emphasis">{planName}</h3>
          <p className="text-xs sm:text-sm text-subtle leading-relaxed">{t.modal.subtitle}</p>
        </div>

        {/* Plan Özeti Rozeti */}
        <div
          data-plan-summary
          className="mb-5 flex items-center justify-between rounded-xl border border-subtle bg-muted/20 p-3.5">
          <div>
            <span className="font-mono text-[10px] text-subtle uppercase tracking-wider">
              {t.modal.selectedPlan}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-cal font-bold text-lg text-emphasis">{planName}</span>
              {isYearly && (
                <span className="rounded-full bg-muted/40 text-emphasis font-mono text-[10px] px-2 py-0.5 font-semibold">
                  {t.pricing.yearly.badge}
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="font-mono text-[10px] text-subtle uppercase tracking-wider">
              {t.modal.price}
            </span>
            <div className="font-cal font-bold text-xl text-emphasis">
              {planPrice} <span className="font-mono text-xs font-normal text-subtle">{planPeriod}</span>
            </div>
          </div>
        </div>

        {/* Doğrudan İletişim Kanalları (Dinamik Admin Verileri) */}
        <div className="space-y-3">
          <span className="block font-mono text-[11px] text-subtle font-medium">
            {t.modal.chooseChannel}:
          </span>

          {/* WhatsApp Aksiyonu */}
          <a
            href={`https://wa.me/${cleanWhatsapp}?text=${prefilledWhatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            data-contact-channel
            className="group flex items-center justify-between rounded-xl border border-subtle bg-muted/20 p-3 transition hover:bg-muted/40">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emphasis text-inverted shadow-xs">
                <MessageSquare className="size-5" />
              </div>
              <div className="text-left">
                <span className="block font-semibold text-sm text-emphasis group-hover:text-emphasis">
                  {t.modal.whatsapp}
                </span>
                <span className="font-mono text-xs text-subtle">+{cleanWhatsapp}</span>
              </div>
            </div>
            <span className="font-mono text-xs text-subtle font-medium">→</span>
          </a>

          {/* Telefonla Arama Aksiyonu */}
          <a
            href={`tel:${cleanPhone}`}
            data-contact-channel
            className="flex items-center justify-between rounded-xl border border-subtle bg-muted/20 p-3 transition hover:border-emphasis/40 hover:bg-muted/40 group">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-subtle bg-muted text-emphasis">
                <Phone className="size-5" />
              </div>
              <div className="text-left">
                <span className="block font-semibold text-sm text-emphasis">{t.modal.phone}</span>
                <span className="font-mono text-xs text-subtle">{phone}</span>
              </div>
            </div>
            <span className="font-mono text-xs text-subtle group-hover:text-emphasis">→</span>
          </a>

          {/* E-posta Gönderme Aksiyonu */}
          <a
            href={`mailto:${email}?subject=${encodeURIComponent(planName + " - rOndevu Aktivasyon")}`}
            data-contact-channel
            className="flex items-center justify-between rounded-xl border border-subtle bg-muted/20 p-3 transition hover:border-emphasis/40 hover:bg-muted/40 group">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-subtle bg-muted text-emphasis">
                <Mail className="size-5" />
              </div>
              <div className="text-left">
                <span className="block font-semibold text-sm text-emphasis">{t.modal.email}</span>
                <span className="font-mono text-xs text-subtle">{email}</span>
              </div>
            </div>
            <span className="font-mono text-xs text-subtle group-hover:text-emphasis">→</span>
          </a>
        </div>

        {/* Bilgilendirme Notu */}
        <p className="mt-6 border-t border-subtle pt-4 text-center font-mono text-[11px] text-subtle leading-relaxed">
          {t.modal.setupNote}
        </p>
      </div>
    </div>
  );
}
