"use client";

import classNames from "@calcom/ui/classNames";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Globe,
  RefreshCw,
  ShieldCheck,
  Video,
} from "lucide-react";
import { useState } from "react";

export function HeroBookingMockup() {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [selectedSlot, setSelectedSlot] = useState<string>("18:45");
  const [isVerifying, setIsVerifying] = useState(false);

  const availableSlots = [{ time: "18:45" }, { time: "19:30" }, { time: "20:15" }];

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
    setActiveStep(2);
  };

  const handleVerifyAndBook = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setActiveStep(3);
    }, 600);
  };

  return (
    <div className="relative mx-auto mt-10 w-full max-w-4xl text-left">
      {/* Arka plan ışık efekti */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-sky-500/10 to-indigo-500/15 blur-xl opacity-60 dark:opacity-40"
      />

      {/* Ana Arayüz Penceresi */}
      <div className="relative overflow-hidden rounded-2xl border border-subtle bg-default shadow-2xl">
        {/* Mockup Tarayıcı Üst Çubuğu */}
        <div className="flex flex-wrap items-center justify-between border-subtle border-b bg-muted/40 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-rose-500/80" />
            <span className="size-2.5 rounded-full bg-amber-500/80" />
            <span className="size-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-mono text-[11px] text-muted-foreground sm:text-xs">
              doktorzeynep.com / online-danismanlik
            </span>
          </div>

          {/* Adım Değiştirici */}
          <div className="flex items-center gap-1 rounded-lg border border-subtle bg-default p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className={classNames(
                "rounded-md px-2.5 py-1 font-medium transition",
                activeStep === 1 ? "bg-emphasis text-default shadow-sm" : "text-subtle hover:text-emphasis"
              )}>
              1. Tarih & Saat
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className={classNames(
                "rounded-md px-2.5 py-1 font-medium transition",
                activeStep === 2 ? "bg-emphasis text-default shadow-sm" : "text-subtle hover:text-emphasis"
              )}>
              2. Form & Doğrulama
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className={classNames(
                "rounded-md px-2.5 py-1 font-medium transition",
                activeStep === 3 ? "bg-emphasis text-default shadow-sm" : "text-subtle hover:text-emphasis"
              )}>
              3. Onay Kartı
            </button>
          </div>
        </div>

        {/* Gerçek Ekran Görüntülerine Birebir Sadık Arayüz Gövdesi */}
        <div className="p-4 sm:p-7 min-h-[440px] flex flex-col justify-center bg-default">
          <AnimatePresence mode="wait">
            {/* 1. ADIM: Tarih & Saat Seçimi (Screenshot 4) */}
            {activeStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Sol Kolon: Profil & Hizmet Detayları (Screenshot 4 sol kolon) */}
                <div className="border-subtle lg:border-r lg:pr-6 lg:col-span-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-sky-600 text-white font-cal font-bold text-xs shadow-sm">
                        ZK
                      </div>
                      <span className="text-xs font-semibold text-emphasis">Dr. Zeynep Kaya</span>
                    </div>

                    <h3 className="mt-2 font-bold font-cal text-emphasis text-lg">Online Bireysel Görüşme</h3>
                    <p className="mt-2 text-xs text-subtle leading-relaxed">
                      Google Meet üzerinden birebir görüntülü görüşme. Randevu oluşturulduğunda bağlantı linki
                      takviminize ve e-posta adresinize otomatik iletilir.
                    </p>

                    <div className="mt-5 space-y-2 text-xs text-subtle">
                      <div className="flex items-center gap-2">
                        <Clock className="size-4 text-subtle" />
                        <span>45dakika</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="size-4 text-emerald-500" />
                        <span className="font-medium text-emphasis">Google Meet</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="size-4 text-subtle" />
                        <span>Europe/Istanbul</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orta Kolon: Takvim Ayı (Screenshot 4 orta kolon) */}
                <div className="lg:col-span-5 flex flex-col justify-between">
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="font-bold text-emphasis text-sm">Eylül 2026</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="rounded p-1 text-subtle hover:bg-muted/50 hover:text-emphasis">
                          <ChevronLeft className="size-4" />
                        </button>
                        <button
                          type="button"
                          className="rounded p-1 text-subtle hover:bg-muted/50 hover:text-emphasis">
                          <ChevronRight className="size-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center font-medium text-[11px] text-subtle mb-2">
                      <span>PAZ</span>
                      <span>PZT</span>
                      <span>SAL</span>
                      <span>ÇAR</span>
                      <span>PER</span>
                      <span>CUM</span>
                      <span>CMT</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      <span className="p-2 text-subtle/20" />
                      <span className="p-2 text-subtle/20" />
                      <span className="p-2 text-subtle/50">8</span>
                      <span className="p-2 text-subtle/50">9</span>
                      <span className="p-2 text-subtle/50">10</span>
                      <span className="p-2 text-subtle/50">11</span>
                      <span className="p-2 text-subtle/50">12</span>

                      <span className="p-2 text-subtle/50">13</span>
                      <span className="p-2 text-subtle/50">14</span>
                      <span className="p-2 text-subtle/50">15</span>
                      <span className="p-2 text-subtle/50">16</span>
                      <span className="p-2 text-subtle/50">17</span>
                      <span className="p-2 text-subtle/50">18</span>
                      <span className="p-2 text-subtle/50">19</span>

                      <span className="p-2 text-subtle/50">20</span>
                      <span className="p-2 text-subtle/50">21</span>
                      <span className="p-2 text-subtle/50">22</span>
                      <span className="p-2 text-subtle/50">23</span>
                      <span className="p-2 text-subtle/50">24</span>
                      {/* Seçili 25. Gün (Screenshot 4'teki beyaz yuvarlak ve nokta stili) */}
                      <span className="relative flex items-center justify-center rounded-lg bg-emphasis text-default font-bold shadow-sm p-2">
                        25
                        <span className="absolute bottom-1 size-1 rounded-full bg-emerald-400" />
                      </span>
                      <span className="p-2 text-subtle/50">26</span>

                      <span className="p-2 text-subtle/50">27</span>
                      <span className="p-2 rounded bg-muted/30 font-medium text-emphasis">28</span>
                      <span className="p-2 rounded bg-muted/30 font-medium text-emphasis">29</span>
                      <span className="p-2 rounded bg-muted/30 font-medium text-emphasis">30</span>
                      <span className="p-2 rounded bg-muted/30 font-medium text-emphasis">1</span>
                      <span className="p-2 rounded bg-muted/30 font-medium text-emphasis">2</span>
                      <span className="p-2 text-subtle/50">3</span>
                    </div>
                  </div>
                </div>

                {/* Sağ Kolon: Müsait Saat Slotları (Screenshot 4 sağ kolon) */}
                <div className="border-subtle lg:border-l lg:pl-6 lg:col-span-3 flex flex-col justify-start">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-semibold text-emphasis text-xs">Cum 25</span>
                    <div className="inline-flex rounded-md border border-subtle bg-muted/30 p-0.5 text-[10px]">
                      <span className="px-1.5 py-0.5 text-subtle">12 sa</span>
                      <span className="rounded bg-default px-1.5 py-0.5 font-medium text-emphasis shadow-xs">
                        24 sa
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => handleSlotSelect(slot.time)}
                        className={classNames(
                          "flex w-full items-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-semibold transition",
                          selectedSlot === slot.time
                            ? "border-emphasis bg-emphasis text-default shadow-sm"
                            : "border-subtle bg-default hover:border-emphasis/50 text-emphasis"
                        )}>
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        <span>{slot.time}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. ADIM: Form & İletişim Doğrulama (Screenshot 5) */}
            {activeStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Sol Kolon: Seçilen Hizmet Özeti (Screenshot 5 sol kolon) */}
                <div className="border-subtle lg:border-r lg:pr-6 lg:col-span-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-sky-600 text-white font-cal font-bold text-[10px]">
                        ZK
                      </div>
                      <span className="text-xs font-medium text-subtle">Dr. Zeynep Kaya</span>
                    </div>

                    <h4 className="font-bold font-cal text-emphasis text-base">Online Bireysel Görüşme</h4>
                    <p className="text-xs text-subtle mt-1 leading-relaxed">
                      Google Meet üzerinden birebir görüntülü görüşme. Randevu oluşturulduğunda bağlantı linki
                      takviminize ve e-posta adresinize otomatik iletilir.
                    </p>

                    <div className="mt-4 space-y-2.5 text-xs text-subtle">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-subtle" />
                        <span className="font-medium text-emphasis">
                          25 Eylül 2026 Cuma {selectedSlot}-19:30
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="size-4 text-subtle" />
                        <span>45dakika</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="size-4 text-emerald-500" />
                        <span className="font-medium text-emphasis">Google Meet</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="size-4 text-subtle" />
                        <span>Europe/Istanbul</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="mt-4 text-xs font-medium text-subtle hover:text-emphasis text-left">
                    ← Tarih ve saati değiştir
                  </button>
                </div>

                {/* Sağ Kolon: Gerçek Form Alanları & E-postayı Doğrula Butonu (Screenshot 5 sağ kolon) */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-emphasis mb-1">Adınız *</label>
                      <input
                        type="text"
                        readOnly
                        value="Ahmet Yılmaz"
                        className="w-full rounded-lg border border-subtle bg-muted/20 px-3 py-2 text-xs text-emphasis outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-emphasis mb-1">E-posta adresi *</label>
                      <input
                        type="email"
                        readOnly
                        value="ahmet.yilmaz@ornek.com"
                        className="w-full rounded-lg border border-subtle bg-muted/20 px-3 py-2 text-xs text-emphasis outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-emphasis mb-1">Ek notlar</label>
                      <textarea
                        readOnly
                        rows={2}
                        value="Lütfen toplantımıza hazırlanmamıza yardımcı olacak her şeyi paylaşın."
                        className="w-full resize-none rounded-lg border border-subtle bg-muted/20 px-3 py-2 text-xs text-emphasis outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-2">
                    <p className="text-[11px] text-subtle mb-3">
                      Devam ederek rOndevu'nun Şartlar ve Gizlilik Politikası'nı kabul etmiş olursunuz
                    </p>
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveStep(1)}
                        className="rounded-lg px-3 py-2 text-xs font-medium text-subtle hover:text-emphasis">
                        Geri
                      </button>
                      <button
                        type="button"
                        onClick={handleVerifyAndBook}
                        disabled={isVerifying}
                        className="rounded-lg bg-emphasis px-5 py-2 text-xs font-medium text-default shadow-sm hover:opacity-95 transition flex items-center gap-2">
                        {isVerifying ? (
                          <>
                            <RefreshCw className="size-3.5 animate-spin" />
                            <span>Doğrulanıyor...</span>
                          </>
                        ) : (
                          <span>E-postayı doğrula</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. ADIM: Başarı Kartı (Screenshot 6) */}
            {activeStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="mx-auto max-w-lg text-center py-2">
                {/* Yeşil Onay İkonu (Screenshot 6) */}
                <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                  <CheckCircle2 className="size-6" />
                </div>

                <h3 className="font-bold font-cal text-emphasis text-xl sm:text-2xl">Toplantı planlandı</h3>
                <p className="mt-1 text-xs text-subtle">
                  Herkese detayları içeren takvim davetiyesini e-posta ile gönderdik.
                </p>

                {/* Özet Tablosu (Screenshot 6 tablosu) */}
                <div className="mt-5 rounded-xl border border-subtle bg-default p-4 text-left text-xs shadow-sm divide-y divide-subtle">
                  <div className="grid grid-cols-3 gap-2 py-2.5">
                    <span className="font-medium text-subtle">Ne</span>
                    <span className="col-span-2 font-medium text-emphasis">
                      Dr. Zeynep Kaya ve Ahmet Yılmaz arasındaki Online Bireysel Görüşme
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2.5">
                    <span className="font-medium text-subtle">Ne zaman</span>
                    <span className="col-span-2 font-medium text-emphasis">
                      25 Eylül 2026 Cuma 18:45 - 19:30 (GMT+03:00)
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2.5">
                    <span className="font-medium text-subtle">Kim</span>
                    <div className="col-span-2 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-emphasis">Dr. Zeynep Kaya</span>
                        <span className="rounded bg-indigo-500/10 px-1.5 py-0.2 text-[10px] font-medium text-indigo-600 dark:text-indigo-400">
                          Host
                        </span>
                      </div>
                      <div className="text-[11px] text-subtle">zeynep@klinik.com</div>
                      <div className="font-medium text-emphasis pt-1">Ahmet Yılmaz</div>
                      <div className="text-[11px] text-subtle">ahmet.yilmaz@ornek.com</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2.5">
                    <span className="font-medium text-subtle">Nerede</span>
                    <div className="col-span-2 flex items-center gap-1.5 text-emphasis font-medium">
                      <span>Google Meet</span>
                      <ExternalLink className="size-3 text-subtle" />
                    </div>
                  </div>
                </div>

                {/* Değişiklik ve Takvime Ekle (Screenshot 6) */}
                <div className="mt-4 text-xs text-subtle">
                  Değişiklik mi yapmanız gerekiyor?{" "}
                  <button type="button" onClick={() => setActiveStep(1)} className="text-emphasis underline">
                    Yeniden planla
                  </button>{" "}
                  veya{" "}
                  <button type="button" onClick={() => setActiveStep(1)} className="text-emphasis underline">
                    İptal et
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-subtle">
                  <span>Takvime ekle</span>
                  <div className="flex items-center gap-1">
                    <span className="rounded border border-subtle bg-muted/30 px-2 py-1 font-mono text-[11px] text-emphasis">
                      G
                    </span>
                    <span className="rounded border border-subtle bg-muted/30 px-2 py-1 font-mono text-[11px] text-emphasis">
                      Outlook
                    </span>
                    <span className="rounded border border-subtle bg-muted/30 px-2 py-1 font-mono text-[11px] text-emphasis">
                      iCal
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* AÇIKLAYICI ÖZELLİK NOTLARI — EKRANIN DIŞINDA (Arayüzü bozmadan net anlatım) */}
      {/* ========================================================================= */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
        <div className="flex items-start gap-2.5 rounded-xl border border-subtle bg-default/80 p-3 shadow-xs">
          <ShieldCheck className="size-4 shrink-0 text-emerald-500 mt-0.5" />
          <div>
            <div className="font-semibold text-emphasis">Google & Apple Takvim Senkronu</div>
            <div className="text-subtle text-[11px] leading-relaxed mt-0.5">
              Alınan tüm randevular anında telefonunuzdaki Google ve Apple takviminize işlenir; hiçbir
              görüşmeyi kaçırmazsınız.
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl border border-subtle bg-default/80 p-3 shadow-xs">
          <CheckCircle2 className="size-4 shrink-0 text-sky-500 mt-0.5" />
          <div>
            <div className="font-semibold text-emphasis">İletişim Doğrulama (OTP)</div>
            <div className="text-subtle text-[11px] leading-relaxed mt-0.5">
              E-posta veya telefon kodu doğrulanmadan randevu açılamaz; sahte taleplerle takviminiz
              kilitlenmez.
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl border border-subtle bg-default/80 p-3 shadow-xs">
          <Clock className="size-4 shrink-0 text-amber-500 mt-0.5" />
          <div>
            <div className="font-semibold text-emphasis">Esnek İptal Kuralları</div>
            <div className="text-subtle text-[11px] leading-relaxed mt-0.5">
              "En geç 12 saat kala iptal edilebilir" gibi belirleyeceğiniz prensiplere göre randevu iptali
              yönetilir.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
