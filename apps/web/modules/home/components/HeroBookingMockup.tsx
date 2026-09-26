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
      {/* Ana Arayüz Penceresi */}
      <div className="relative overflow-hidden rounded-2xl border border-subtle bg-default shadow-xl">
        {/* Mockup Tarayıcı Üst Çubuğu (Responsive, adresi ve adımları ferah tutar) */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between border-subtle border-b bg-muted/30 px-3.5 py-2.5 sm:px-6 sm:py-3">
          {/* Adres Çubuğu & Trafik Işıkları */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="size-2 rounded-full bg-subtle/40 sm:size-2.5" />
              <span className="size-2 rounded-full bg-subtle/40 sm:size-2.5" />
              <span className="size-2 rounded-full bg-subtle/40 sm:size-2.5" />
            </div>
            <div className="flex items-center gap-1.5 rounded-md border border-subtle/60 bg-default/80 px-2.5 py-1 font-mono text-[11px] text-muted-foreground sm:text-xs shadow-2xs min-w-0">
              <Globe className="size-3 shrink-0 text-subtle" />
              <span className="truncate">doktorzeynep.com/online-danismanlik</span>
            </div>
          </div>

          {/* Adım Değiştirici (Mobilde eşit 3 sütun, taşmaz / aşağı kaydırmaz) */}
          <div className="grid grid-cols-3 sm:flex items-center gap-1 rounded-lg border border-subtle bg-default p-0.5 text-xs w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className={classNames(
                "rounded-md px-2 py-1 font-medium transition text-center",
                activeStep === 1 ? "bg-emphasis text-default shadow-sm" : "text-subtle hover:text-emphasis"
              )}>
              <span className="sm:hidden">1. Tarih</span>
              <span className="hidden sm:inline">1. Tarih & Saat</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className={classNames(
                "rounded-md px-2 py-1 font-medium transition text-center",
                activeStep === 2 ? "bg-emphasis text-default shadow-sm" : "text-subtle hover:text-emphasis"
              )}>
              <span className="sm:hidden">2. Form</span>
              <span className="hidden sm:inline">2. Form & Doğrulama</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className={classNames(
                "rounded-md px-2 py-1 font-medium transition text-center",
                activeStep === 3 ? "bg-emphasis text-default shadow-sm" : "text-subtle hover:text-emphasis"
              )}>
              <span className="sm:hidden">3. Onay</span>
              <span className="hidden sm:inline">3. Onay Kartı</span>
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
                <div className="border-subtle border-b pb-4 lg:border-b-0 lg:border-r lg:pr-6 lg:pb-0 lg:col-span-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex size-9 items-center justify-center rounded-full border border-subtle bg-muted font-cal font-semibold text-emphasis text-xs shadow-xs">
                        ZK
                      </div>
                      <span className="text-xs font-semibold text-emphasis">Dr. Zeynep Kaya</span>
                    </div>

                    <h3 className="mt-2 font-bold font-cal text-emphasis text-lg">Online Bireysel Görüşme</h3>
                    <p className="mt-2 text-xs text-subtle leading-relaxed">
                      Google Meet üzerinden birebir görüntülü görüşme. Randevu oluşturulduğunda bağlantı linki
                      takviminize ve e-posta adresinize otomatik iletilir.
                    </p>

                    <div className="mt-4 sm:mt-5 space-y-2 text-xs text-subtle">
                      <div className="flex items-center gap-2">
                        <Clock className="size-4 text-subtle" />
                        <span>45dakika</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="size-4 text-emphasis" />
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
                <div className="lg:col-span-5 flex flex-col justify-between py-1 lg:py-0">
                  <div>
                    <div className="mb-3 sm:mb-4 flex items-center justify-between">
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

                    <div className="grid grid-cols-7 gap-1 text-center font-medium text-[10px] sm:text-[11px] text-subtle mb-1 sm:mb-2">
                      <span>PAZ</span>
                      <span>PZT</span>
                      <span>SAL</span>
                      <span>ÇAR</span>
                      <span>PER</span>
                      <span>CUM</span>
                      <span>CMT</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      <span className="h-8 sm:h-9" />
                      <span className="h-8 sm:h-9" />
                      <span className="h-8 sm:h-9 flex items-center justify-center rounded-lg text-subtle/50 text-xs">
                        8
                      </span>
                      <span className="h-8 sm:h-9 flex items-center justify-center rounded-lg text-subtle/50 text-xs">
                        9
                      </span>
                      <span className="h-8 sm:h-9 flex items-center justify-center rounded-lg text-subtle/50 text-xs">
                        10
                      </span>
                      <span className="h-8 sm:h-9 flex items-center justify-center rounded-lg text-subtle/50 text-xs">
                        11
                      </span>
                      <span className="h-8 sm:h-9 flex items-center justify-center rounded-lg text-subtle/50 text-xs">
                        12
                      </span>

                      <span className="h-8 sm:h-9 flex items-center justify-center rounded-lg text-subtle/50 text-xs">
                        13
                      </span>
                      <span className="h-8 sm:h-9 flex items-center justify-center rounded-lg text-subtle/50 text-xs">
                        14
                      </span>
                      <span className="h-8 sm:h-9 flex items-center justify-center rounded-lg text-subtle/50 text-xs">
                        15
                      </span>
                      <span className="h-8 sm:h-9 flex items-center justify-center rounded-lg text-subtle/50 text-xs">
                        16
                      </span>
                      <span className="h-8 sm:h-9 flex items-center justify-center rounded-lg text-subtle/50 text-xs">
                        17
                      </span>
                      <span className="h-8 sm:h-9 flex items-center justify-center rounded-lg text-subtle/50 text-xs">
                        18
                      </span>
                      <span className="h-8 sm:h-9 flex items-center justify-center rounded-lg text-subtle/50 text-xs">
                        19
                      </span>

                      <span className="h-8 sm:h-9 flex items-center justify-center rounded-lg text-subtle/50 text-xs">
                        20
                      </span>
                      <span className="h-8 sm:h-9 flex items-center justify-center rounded-lg text-subtle/50 text-xs">
                        21
                      </span>
                      <span className="h-8 sm:h-9 flex items-center justify-center rounded-lg text-subtle/50 text-xs">
                        22
                      </span>
                      <span className="h-8 sm:h-9 flex items-center justify-center rounded-lg text-subtle/50 text-xs">
                        23
                      </span>
                      <span className="h-8 sm:h-9 flex items-center justify-center rounded-lg text-subtle/50 text-xs">
                        24
                      </span>
                      {/* Seçili 25. Gün (Screenshot 4'teki stil) */}
                      <span className="relative h-8 sm:h-9 flex items-center justify-center rounded-lg bg-emphasis text-default font-bold shadow-sm text-xs">
                        25
                        <span className="absolute bottom-1 size-1 rounded-full bg-emerald-400" />
                      </span>
                      <span className="h-8 sm:h-9 flex items-center justify-center rounded-lg text-subtle/50 text-xs">
                        26
                      </span>

                      <span className="h-8 sm:h-9 flex items-center justify-center rounded-lg text-subtle/50 text-xs">
                        27
                      </span>
                      <span className="h-8 sm:h-9 flex items-center justify-center rounded-lg bg-muted/30 font-medium text-emphasis text-xs">
                        28
                      </span>
                      <span className="h-8 sm:h-9 flex items-center justify-center rounded-lg bg-muted/30 font-medium text-emphasis text-xs">
                        29
                      </span>
                      <span className="h-8 sm:h-9 flex items-center justify-center rounded-lg bg-muted/30 font-medium text-emphasis text-xs">
                        30
                      </span>
                      <span className="h-8 sm:h-9 flex items-center justify-center rounded-lg bg-muted/30 font-medium text-emphasis text-xs">
                        1
                      </span>
                      <span className="h-8 sm:h-9 flex items-center justify-center rounded-lg bg-muted/30 font-medium text-emphasis text-xs">
                        2
                      </span>
                      <span className="h-8 sm:h-9 flex items-center justify-center rounded-lg text-subtle/50 text-xs">
                        3
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sağ Kolon: Müsait Saat Slotları (Mobilde yatay 3'lü sıra, ferah ve kullanışlı) */}
                <div className="border-subtle border-t pt-4 mt-1 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0 lg:mt-0 lg:col-span-3 flex flex-col justify-start">
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="font-semibold text-emphasis text-xs">Cum 25 · Saat Seçimi</span>
                    <div className="inline-flex rounded-md border border-subtle bg-muted/30 p-0.5 text-[10px]">
                      <span className="px-1.5 py-0.5 text-subtle">12 sa</span>
                      <span className="rounded bg-default px-1.5 py-0.5 font-medium text-emphasis shadow-xs">
                        24 sa
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 lg:grid-cols-1 lg:space-y-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => handleSlotSelect(slot.time)}
                        className={classNames(
                          "flex items-center justify-center lg:justify-start gap-1.5 sm:gap-2 rounded-lg border px-2 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold transition",
                          selectedSlot === slot.time
                            ? "border-emphasis bg-emphasis text-default shadow-sm"
                            : "border-subtle bg-default hover:border-emphasis/50 text-emphasis"
                        )}>
                        <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
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
                <div className="border-subtle border-b pb-4 lg:border-b-0 lg:border-r lg:pr-6 lg:pb-0 lg:col-span-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex size-7 items-center justify-center rounded-full border border-subtle bg-muted font-cal font-semibold text-emphasis text-[10px]">
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
                        <Video className="size-4 text-emphasis" />
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
                <div className="lg:col-span-7 flex flex-col justify-between pt-1 lg:pt-0">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-emphasis mb-1">Adınız *</label>
                      <input
                        type="text"
                        readOnly
                        value="Ahmet Yılmaz"
                        className="w-full rounded-lg border border-subtle bg-muted/20 px-3.5 py-2.5 text-xs text-emphasis outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-emphasis mb-1">E-posta adresi *</label>
                      <input
                        type="email"
                        readOnly
                        value="ahmet.yilmaz@ornek.com"
                        className="w-full rounded-lg border border-subtle bg-muted/20 px-3.5 py-2.5 text-xs text-emphasis outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-emphasis mb-1">Ek notlar</label>
                      <textarea
                        readOnly
                        rows={2}
                        value="Lütfen toplantımıza hazırlanmamıza yardımcı olacak her şeyi paylaşın."
                        className="w-full resize-none rounded-lg border border-subtle bg-muted/20 px-3.5 py-2.5 text-xs text-emphasis outline-none"
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

            {/* 3. ADIM: Başarı Kartı (Screenshot 2026-09-25 at 16-57-09 Birebir) */}
            {activeStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="mx-auto max-w-lg text-center py-2">
                {/* Geri Dön Linki (Screenshot ile uyumlu sol üst) */}
                <div className="text-left mb-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="text-xs text-subtle hover:text-emphasis inline-flex items-center gap-1 transition">
                    <span>‹ Rezervasyonlara dön</span>
                  </button>
                </div>

                {/* Yeşil Onay İkonu */}
                <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
                  <CheckCircle2 className="size-6" />
                </div>

                <h3 className="font-bold font-cal text-emphasis text-xl sm:text-2xl">Toplantı planlandı</h3>
                <p className="mt-1 text-xs text-subtle">
                  Herkese detayları içeren takvim davetiyesini e-posta ile gönderdik.
                </p>

                {/* Özet Tablosu (Mobilde etiket üstte değer altta ferah görünüm) */}
                <div className="mt-5 rounded-xl border border-subtle bg-default p-4 text-left text-xs shadow-xs divide-y divide-subtle">
                  <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2 py-2.5">
                    <span className="font-medium text-subtle">Ne</span>
                    <span className="sm:col-span-2 font-medium text-emphasis">
                      Dr. Zeynep Kaya ve Ahmet Yılmaz arasındaki Online Bireysel Görüşme
                    </span>
                  </div>

                  <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2 py-2.5">
                    <span className="font-medium text-subtle">Ne zaman</span>
                    <span className="sm:col-span-2 font-medium text-emphasis">
                      25 Eylül 2026 Cuma 18:45 - 19:30 (GMT+03:00)
                    </span>
                  </div>

                  <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2 py-2.5">
                    <span className="font-medium text-subtle">Kim</span>
                    <div className="sm:col-span-2 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-emphasis">Dr. Zeynep Kaya</span>
                        <span className="rounded border border-subtle bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-subtle">
                          Host
                        </span>
                      </div>
                      <div className="text-[11px] text-subtle">zeynep@klinik.com</div>
                      <div className="font-medium text-emphasis pt-1">Ahmet Yılmaz</div>
                      <div className="text-[11px] text-subtle">ahmet.yilmaz@ornek.com</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2 py-2.5">
                    <span className="font-medium text-subtle">Nerede</span>
                    <div className="sm:col-span-2 flex items-center gap-1.5 text-emphasis font-medium">
                      <span>Google Meet</span>
                      <ExternalLink className="size-3 text-subtle" />
                    </div>
                  </div>
                </div>

                {/* Değişiklik ve Takvime Ekle (Screenshot 16-57-09 Birebir) */}
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

                {/* Orijinal Takvime Ekle 4 İkon Buton (Google, Outlook, Office 365, ICS) */}
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs text-emphasis">
                  <span className="font-medium text-subtle">Takvime ekle</span>
                  <div className="flex items-center gap-1.5">
                    {/* Google Calendar */}
                    <div
                      title="Google Takvim"
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-subtle bg-default hover:bg-muted/40 transition text-emphasis cursor-pointer shadow-xs">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <title>Google</title>
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                      </svg>
                    </div>

                    {/* Microsoft Outlook */}
                    <div
                      title="Microsoft Outlook"
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-subtle bg-default hover:bg-muted/40 transition text-emphasis cursor-pointer shadow-xs">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <title>Microsoft Outlook</title>
                        <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.55q0-.44.3-.75.3-.3.75-.3h12.9q.44 0 .75.3.3.3.3.75V10.85l1.24.72h.01q.1.07.18.18.07.12.07.25zm-6-8.25v3h3v-3zm0 4.5v3h3v-3zm0 4.5v1.83l3.05-1.83zm-5.25-9v3h3.75v-3zm0 4.5v3h3.75v-3zm0 4.5v2.03l2.41 1.5 1.34-.8v-2.73zM9 3.75V6h2l.13.01.12.04v-2.3zM5.98 15.98q.9 0 1.6-.3.7-.32 1.19-.86.48-.55.73-1.28.25-.74.25-1.61 0-.83-.25-1.55-.24-.71-.71-1.24t-1.15-.83q-.68-.3-1.55-.3-.92 0-1.64.3-.71.3-1.2.85-.5.54-.75 1.3-.25.74-.25 1.63 0 .85.26 1.56.26.72.74 1.23.48.52 1.17.81.69.3 1.56.3zM7.5 21h12.39L12 16.08V17q0 .41-.3.7-.29.3-.7.3H7.5zm15-.13v-7.24l-5.9 3.54Z" />
                      </svg>
                    </div>

                    {/* Microsoft 365 / Office */}
                    <div
                      title="Microsoft 365"
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-subtle bg-default hover:bg-muted/40 transition text-emphasis cursor-pointer shadow-xs">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <title>Microsoft Office</title>
                        <path d="M21.53 4.306v15.363q0 .807-.472 1.433-.472.627-1.253.85l-6.888 1.974q-.136.037-.29.055-.156.019-.293.019-.396 0-.72-.105-.321-.106-.656-.292l-4.505-2.544q-.248-.137-.391-.366-.143-.23-.143-.515 0-.434.304-.738.304-.305.739-.305h5.831V4.964l-4.38 1.563q-.533.187-.856.658-.322.472-.322 1.03v8.078q0 .496-.248.912-.25.416-.683.651l-2.072 1.13q-.286.148-.571.148-.497 0-.844-.347-.348-.347-.348-.844V6.563q0-.62.33-1.19.328-.571.874-.881L11.07.285q.248-.136.534-.21.285-.075.57-.075.211 0 .38.031.166.031.364.093l6.888 1.899q.384.11.7.329.317.217.547.52.23.305.353.67.125.367.125.764zm-1.588 15.363V4.306q0-.273-.16-.478-.163-.204-.423-.28l-3.388-.93q-.397-.111-.794-.23-.397-.117-.794-.216v19.68l4.976-1.427q.26-.074.422-.28.161-.204.161-.477z" />
                      </svg>
                    </div>

                    {/* .ics (iCal / Diğer) */}
                    <div
                      title="Apple Takvim / .ics"
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-subtle bg-default hover:bg-muted/40 transition text-emphasis cursor-pointer shadow-xs">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 1000 1000">
                        <title>Apple Takvim / iCal (.ics)</title>
                        <path d="M971.3,154.9c0-34.7-28.2-62.9-62.9-62.9H611.7c-1.3,0-2.6,0.1-3.9,0.2V10L28.7,87.3v823.4L607.8,990v-84.6c1.3,0.1,2.6,0.2,3.9,0.2h296.7c34.7,0,62.9-28.2,62.9-62.9V154.9z M607.8,636.1h44.6v-50.6h-44.6v-21.9h44.6v-50.6h-44.6v-92h277.9v230.2c0,3.8-3.1,7-7,7H607.8V636.1z M117.9,644.7l-50.6-2.4V397.5l50.6-2.2V644.7z M288.6,607.3c17.6,0.6,37.3-2.8,49.1-7.2l9.1,48c-11,5.1-35.6,9.9-66.9,8.3c-85.4-4.3-127.5-60.7-127.5-132.6c0-86.2,57.8-136.7,133.2-140.1c30.3-1.3,53.7,4,64.3,9.2l-12.2,48.9c-12.1-4.9-28.8-9.2-49.5-8.6c-45.3,1.2-79.5,30.1-79.5,87.4C208.8,572.2,237.8,605.7,288.6,607.3z M455.5,665.2c-32.4-1.6-63.7-11.3-79.1-20.5l12.6-50.7c16.8,9.1,42.9,18.5,70.4,19.4c30.1,1,46.3-10.7,46.3-29.3c0-17.8-14-28.1-48.8-40.6c-46.9-16.4-76.8-41.7-76.8-81.5c0-46.6,39.3-84.1,106.8-87.1c33.3-1.5,58.3,4.2,76.5,11.2l-15.4,53.3c-12.1-5.3-33.5-12.8-62.3-12c-28.3,0.8-41.9,13.6-41.9,28.1c0,17.8,16.1,25.5,53.6,39c52.9,18.5,78.4,45.3,78.4,86.4C575.6,629.7,536.2,669.2,455.5,665.2z M935.3,842.7c0,14.9-12.1,27-27,27H611.7c-1.3,0-2.6-0.2-3.9-0.4V686.2h270.9c19.2,0,34.9-15.6,34.9-34.9V398.4c0-19.2-15.6-34.9-34.9-34.9h-47.1v-32.3H808v32.3h-44.8v-32.3h-22.7v32.3h-43.3v-32.3h-22.7v32.3H628v-32.3h-20.2v-203c1.31.2,2.6-0.4,3.9-0.4h296.7c14.9,0,27,12.1,27,27L935.3,842.7L935.3,842.7z" />
                      </svg>
                    </div>
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
          <ShieldCheck className="size-4 shrink-0 text-emphasis mt-0.5" />
          <div>
            <div className="font-semibold text-emphasis">Google & Apple Takvim Senkronu</div>
            <div className="text-subtle text-[11px] leading-relaxed mt-0.5">
              Alınan tüm randevular anında telefonunuzdaki Google ve Apple takviminize işlenir; hiçbir
              görüşmeyi kaçırmazsınız.
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl border border-subtle bg-default/80 p-3 shadow-xs">
          <CheckCircle2 className="size-4 shrink-0 text-emphasis mt-0.5" />
          <div>
            <div className="font-semibold text-emphasis">İletişim Doğrulama (OTP)</div>
            <div className="text-subtle text-[11px] leading-relaxed mt-0.5">
              E-posta veya telefon kodu doğrulanmadan randevu açılamaz; sahte taleplerle takviminiz
              kilitlenmez.
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl border border-subtle bg-default/80 p-3 shadow-xs">
          <Clock className="size-4 shrink-0 text-emphasis mt-0.5" />
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
