"use client";

import { Calendar, CheckCircle2, Copy, Globe } from "lucide-react";
import { useState } from "react";

export function ProcessSteps() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("https://rondevu.org/adiniz");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      id="how-it-works"
      aria-labelledby="process-title"
      className="border-subtle/80 border-t pt-14 pb-8 sm:pt-20 sm:pb-12">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2
          id="process-title"
          className="font-bold font-cal text-2xl text-emphasis tracking-tight sm:text-3xl">
          Nasıl Çalışır?
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-subtle leading-relaxed">
          Randevu sürecinizi karmaşık ayarlarla uğraşmadan dakikalar içinde kurun ve hemen kullanmaya
          başlayın.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Adım 01: Randevu Sayfanı Oluştur */}
        <div className="flex flex-col justify-between rounded-2xl border border-subtle bg-default p-6 shadow-xs transition hover:border-emphasis/40">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="font-bold font-mono text-emphasis text-xs">Adım 01</span>
              <span className="rounded-full border border-subtle bg-muted/50 px-2.5 py-0.5 font-mono font-semibold text-[10px] text-subtle">
                Kurulum
              </span>
            </div>
            <h3 className="font-bold font-cal text-emphasis text-lg">Randevu Sayfanı Oluştur</h3>
            <p className="mt-2 text-subtle text-xs leading-relaxed sm:text-sm">
              Çalışma gün ve saatlerinizi belirleyin; size özel randevu bağlantınızı saniyeler içinde alın.
            </p>
          </div>

          <div className="mt-6 pt-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex w-full items-center justify-between rounded-xl border border-subtle bg-muted/30 px-3.5 py-2.5 text-left text-xs transition hover:border-subtle/80 hover:bg-muted/60">
              <div className="flex min-w-0 items-center gap-2 font-mono">
                <Globe className="size-3.5 shrink-0 text-subtle" />
                <span className="truncate font-medium text-emphasis">rondevu.org/adiniz</span>
              </div>
              <span className="flex shrink-0 items-center gap-1 rounded border border-subtle bg-default px-2 py-0.5 font-medium font-sans text-[10px] text-emphasis shadow-2xs">
                <Copy className="size-2.5 text-subtle" />
                <span>{copied ? "Kopyalandı" : "Kopyala"}</span>
              </span>
            </button>
          </div>
        </div>

        {/* Adım 02: Takvimini Bağla & Linkini Paylaş */}
        <div className="flex flex-col justify-between rounded-2xl border border-subtle bg-default p-6 shadow-xs transition hover:border-emphasis/40">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="font-bold font-mono text-emphasis text-xs">Adım 02</span>
              <span className="rounded-full border border-subtle bg-muted/50 px-2.5 py-0.5 font-mono font-semibold text-[10px] text-subtle">
                Entegrasyon
              </span>
            </div>
            <h3 className="font-bold font-cal text-emphasis text-lg">Takvimini Bağla & Linkini Paylaş</h3>
            <p className="mt-2 text-subtle text-xs leading-relaxed sm:text-sm">
              Google veya Apple Takviminizi bağlayın; linkinizi WhatsApp veya Instagram profilinize ekleyin.
            </p>
          </div>

          <div className="mt-6 pt-2">
            <div className="flex items-center justify-between rounded-xl border border-subtle bg-muted/30 px-3.5 py-2.5 text-emphasis text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="size-3.5 text-emphasis" />
                <span className="font-medium text-[11px] sm:text-xs">Google & Apple Takvim</span>
              </div>
              <span className="flex size-2 rounded-full bg-emerald-500 shadow-2xs" />
            </div>
          </div>
        </div>

        {/* Adım 03: Takvimin Dolsun */}
        <div className="flex flex-col justify-between rounded-2xl border border-subtle bg-default p-6 shadow-xs transition hover:border-emphasis/40">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="font-bold font-mono text-emphasis text-xs">Adım 03</span>
              <span className="rounded-full border border-subtle bg-muted/50 px-2.5 py-0.5 font-mono font-semibold text-[10px] text-subtle">
                Otomasyon
              </span>
            </div>
            <h3 className="font-bold font-cal text-emphasis text-lg">Takvimin Dolsun</h3>
            <p className="mt-2 text-subtle text-xs leading-relaxed sm:text-sm">
              Danışanlarınız uygun saati seçip onaylasın; randevular takviminize çakışmasız otomatik işlensin.
            </p>
          </div>

          <div className="mt-6 pt-2">
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2.5 text-xs">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="size-4" />
              </div>
              <div className="font-semibold text-emerald-300 text-xs">Yeni Randevu Onaylandı</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
