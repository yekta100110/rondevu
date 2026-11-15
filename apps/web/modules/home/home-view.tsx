"use client";

import type { PlanContactConfig } from "@calcom/lib/planContactConfig";
import { trpc } from "@calcom/trpc/react";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Globe,
  Lock,
  MessageCircle,
  MessageSquare,
  Minus,
  Plus,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { MarketingFooter } from "./components/MarketingFooter";
import { MarketingHeader } from "./components/MarketingHeader";
import { PlanContactModal } from "./components/PlanContactModal";
import type { Locale } from "./i18n/home-translations";

interface HomeViewProps {
  html?: string;
  svgTemplates?: string;
  isLoggedIn?: boolean;
  initialContact?: PlanContactConfig;
  initialLocale?: Locale;
}

interface SpecialistProfile {
  name: string;
  specialty: string;
  service: string;
  duration: string;
  avatar: string;
}

const SPECIALIST_PROFILES: Record<Locale, SpecialistProfile[]> = {
  tr: [
    {
      name: "Uzm. Dyt. Selin Aktaş",
      specialty: "Beslenme & Diyet",
      service: "Bireysel Beslenme Seansı",
      duration: "45 dk",
      avatar: "SA",
    },
    {
      name: "Psk. Cem Arslan",
      specialty: "Klinik Psikoloji",
      service: "Bireysel Terapi Görüşmesi",
      duration: "50 dk",
      avatar: "CA",
    },
    {
      name: "Fzt. Elif Kaya",
      specialty: "Manuel Terapi & Rehabilitasyon",
      service: "Fizik Tedavi & Egzersiz Seansı",
      duration: "60 dk",
      avatar: "EK",
    },
    {
      name: "Stilist Burak Demir",
      specialty: "Kuaför & Saç Tasarımı",
      service: "Özel Bakım ve Kesim",
      duration: "30 dk",
      avatar: "BD",
    },
  ],
  en: [
    {
      name: "Selin Aktas, RD",
      specialty: "Clinical Dietitian",
      service: "Personal Nutrition Session",
      duration: "45 min",
      avatar: "SA",
    },
    {
      name: "Cem Arslan, MSc",
      specialty: "Clinical Psychologist",
      service: "Individual Therapy Session",
      duration: "50 min",
      avatar: "CA",
    },
    {
      name: "Elif Kaya, PT",
      specialty: "Physical Therapy & Rehab",
      service: "Physiotherapy & Exercise Session",
      duration: "60 min",
      avatar: "EK",
    },
    {
      name: "Burak Demir",
      specialty: "Hair & Grooming Specialist",
      service: "Signature Cut & Styling",
      duration: "30 min",
      avatar: "BD",
    },
  ],
};

const DURATION_OPTIONS = {
  tr: ["15 dk", "30 dk", "45 dk", "60 dk"],
  en: ["15 min", "30 min", "45 min", "60 min"],
};

const AVAILABLE_DAYS = [18, 19, 20, 21, 22, 25, 26, 27];
const TIME_SLOTS = ["09:30", "11:00", "13:30", "15:00", "16:30"];

interface FaqEntry {
  q: string;
  a: string;
}

const FAQ_LIST: Record<Locale, FaqEntry[]> = {
  tr: [
    {
      q: "rOndevu kurulumu ne kadar sürer, teknik bilgi gerekir mi?",
      a: "Herhangi bir kodlama veya teknik kurulum gerekmez. Hesabınız oluşturulduktan sonra çalışma saatlerinizi belirleyip takviminizi bağlayarak 5 dakika içinde randevu almaya başlayabilirsiniz.",
    },
    {
      q: "SMS doğrulaması nasıl çalışır ve randevu kayıplarını nasıl önler?",
      a: "Danışan randevu saatini seçtikten sonra telefon numarasına gelen tek kullanımlık SMS onay kodunu girer. Böylece sahte, hatalı veya mükerrer numaralarla randevu oluşturulması engellenir; takviminiz yalnızca gerçek danışanlara ayrılır.",
    },
    {
      q: "WhatsApp bildirimleri için ek bir hesap veya kurulum gerekir mi?",
      a: "Hayır. Randevu onayları ve randevu öncesi hatırlatma mesajları sistem tarafından doğrudan iletilir. Danışanınız onay ve adres detaylarını doğrudan WhatsApp mesajı olarak alır.",
    },
    {
      q: "Google ve Microsoft Outlook takvimimle çakışmalar nasıl engellenir?",
      a: "Takvim hesabınızı tek tıkla yetkilendirebilirsiniz. Kişisel takviminizde oluşturduğunuz herhangi bir etkinlik randevu saatlerinizi anında kapatır; rOndevu üzerinden alınan randevular ise doğrudan kişisel takviminize işlenir. Çift randevu riski tamamen ortadan kalkar.",
    },
    {
      q: "Özel alan adı (CNAME) kullanabilir miyim?",
      a: "Evet. Randevu sayfanızı kendi alan adınız altında (örneğin randevu.kliniginiz.com veya randevu.adiniz.com) çalıştırabilirsiniz. Otomatik SSL sertifikası sistem tarafından sağlanır ve danışanlarınıza kurumsal bir güven verir.",
    },
    {
      q: "Ofis Dışı ve İzin günlerimi nasıl planlarım?",
      a: "Ofis Dışı / İzinlerim bölümünden resmi tatilleri, yıllık izinlerinizi veya beklenmedik randevusuz günlerinizi seçebilirsiniz. Haftalık çalışma saati şablonunuzu bozmadan dilediğiniz tarih aralığını anında randevulara kapatabilirsiniz.",
    },
    {
      q: "Aylık ve yıllık planlar arasında fark var mı, geçiş yapabilir miyim?",
      a: "Tüm özellikler her iki pakette de eksiksiz sunulur. Yıllık planda 2 ay hediye avantajından yararlanır ve fiyatınızı 12 ay boyunca sabitlersiniz. Dilediğiniz zaman planlar arasında geçiş yapabilirsiniz.",
    },
  ],
  en: [
    {
      q: "How long does setup take, and do I need technical skills?",
      a: "No coding or technical skills are required. Once your workspace is ready, define your working hours, connect your calendar, and start receiving appointments within 5 minutes.",
    },
    {
      q: "How does SMS verification work and prevent no-shows?",
      a: "When clients pick a time slot, they confirm a one-time SMS verification code sent to their mobile phone. This stops spam, invalid, or duplicate bookings and keeps your schedule filled only by verified clients.",
    },
    {
      q: "Do I need separate setup for WhatsApp notifications?",
      a: "No. Booking confirmations and reminders are delivered automatically by the platform. Your clients receive time, location, and session notes directly via WhatsApp.",
    },
    {
      q: "How does two-way calendar sync prevent schedule conflicts?",
      a: "Connect Google Calendar or Microsoft Outlook with a single authorization. Personal appointments on your calendar instantly block booking windows on rOndevu, and new client reservations appear immediately in your schedule.",
    },
    {
      q: "Can I use my own custom domain (CNAME)?",
      a: "Yes. You can publish your booking page on your own domain (such as booking.yourclinic.com). An automatic SSL certificate is provisioned to give clients a seamless, trusted experience.",
    },
    {
      q: "How do I manage holidays and out-of-office days?",
      a: "Using the Out of Office / Leaves section, block specific dates or ranges for holidays and personal time off without altering your recurring weekly schedule.",
    },
    {
      q: "Is there any feature difference between monthly and yearly plans?",
      a: "All features are identical in both plans. The yearly plan includes 2 free months and locks your price for 12 months. You can transition between plans whenever you wish.",
    },
  ],
};

function HomeView({
  html: _html,
  svgTemplates: _svgTemplates,
  isLoggedIn = false,
  initialContact,
  initialLocale = "tr",
}: HomeViewProps) {
  const router = useRouter();
  const locale = initialLocale;

  const [modalPlanType, setModalPlanType] = useState<"general" | "monthly" | "yearly" | null>(null);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);
  const [selectedDurationIndex, setSelectedDurationIndex] = useState(1);
  const [selectedDay, setSelectedDay] = useState(19);
  const [selectedTime, setSelectedTime] = useState("13:30");
  const [isSimulatedVerified, setIsSimulatedVerified] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const baseFaqId = useId();

  useEffect(() => {
    document.title =
      locale === "tr"
        ? "rOndevu - Herkes İçin Randevu Sistemi"
        : "rOndevu - Clear & Simple Appointment Scheduling";
  }, [locale]);

  const { data: contactConfig } = trpc.viewer.public.getPlanContact.useQuery(undefined, {
    staleTime: 30000,
  });

  const resolvedContact = contactConfig ?? initialContact;
  const phone =
    resolvedContact?.phone && resolvedContact.phone !== "0850 000 00 00"
      ? resolvedContact.phone
      : "0552 119 19 87";
  const email = resolvedContact?.email || "destek@rondevu.org";
  const whatsapp =
    resolvedContact?.whatsapp && resolvedContact.whatsapp !== "908500000000"
      ? resolvedContact.whatsapp
      : "905521191987";

  const handleModalClose = (): void => {
    setModalPlanType(null);
  };

  const pricingHref = locale === "en" ? "/en/pricing" : "/pricing";
  const profiles = SPECIALIST_PROFILES[locale];
  const activeProfile = profiles[selectedProfileIndex] ?? profiles[0];
  const durations = DURATION_OPTIONS[locale];
  const faqItems = FAQ_LIST[locale];

  return (
    <div className="min-h-screen bg-[#111214] text-[#F4F4F2] selection:bg-[#26282e] selection:text-[#F4F4F2] antialiased">
      {/* 1. Header Navigation */}
      <MarketingHeader
        locale={locale}
        isLoggedIn={isLoggedIn}
        onContactClick={() => setModalPlanType("general")}
      />

      <main className="w-full">
        {/* =========================================================
            SCREEN 1: HERO SECTION
            ========================================================= */}
        <section
          aria-labelledby="hero-title"
          className="relative border-b border-[#26282e] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
              {/* Left Column: Value Proposition & Clear Actions */}
              <div className="lg:col-span-6 lg:pr-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#26282e] bg-[#18191d] px-3.5 py-1.5 text-xs text-[#9CA3AF]">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                  <span>
                    {locale === "tr"
                      ? "Doğrulanmış Randevu ve Takvim Yönetimi"
                      : "Verified Appointment & Calendar Management"}
                  </span>
                </div>

                <h1
                  id="hero-title"
                  className="mt-6 text-3xl font-bold tracking-tight text-[#F4F4F2] sm:text-4xl lg:text-5xl">
                  {locale === "tr"
                    ? "Randevu sürecinizi tek merkezden yönetin."
                    : "Streamline your client bookings with total clarity."}
                </h1>

                <p className="mt-5 text-base leading-relaxed text-[#9CA3AF] sm:text-lg">
                  {locale === "tr"
                    ? "Diyetisyenler, psikologlar, klinikler ve randevuyla çalışan uzmanlar için: Takvim eşitlemesi, SMS doğrulaması ve WhatsApp bildirimleri tek ekranda."
                    : "Tailored for dietitians, psychologists, clinics, and independent specialists: Calendar sync, SMS verification, and WhatsApp notifications in one place."}
                </p>

                {/* Primary CTA Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href={pricingHref}
                    className="inline-flex min-h-[46px] items-center justify-center rounded-lg bg-[#F4F4F2] px-6 text-sm font-semibold text-[#111214] transition hover:bg-white active:scale-[0.98]">
                    {locale === "tr" ? "Planları İnceleyin" : "View Plans"}
                  </Link>

                  <button
                    type="button"
                    onClick={() => setModalPlanType("general")}
                    className="inline-flex min-h-[46px] items-center justify-center rounded-lg border border-[#26282e] bg-[#18191d] px-5 text-sm font-semibold text-[#F4F4F2] transition hover:border-[#3a3d46] hover:bg-[#1f2127] active:scale-[0.98]">
                    <MessageCircle className="mr-2 h-4 w-4 text-emerald-400" aria-hidden="true" />
                    {locale === "tr" ? "Bilgi Alın" : "Contact Us"}
                  </button>
                </div>

                {/* Core Facts Checklist */}
                <ul className="mt-10 space-y-3 text-xs sm:text-sm text-[#9CA3AF]">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                    <span>
                      {locale === "tr"
                        ? "SMS doğrulamasıyla sahte ve mükerrer randevulara son"
                        : "SMS verification prevents invalid and duplicate bookings"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                    <span>
                      {locale === "tr"
                        ? "Google ve Outlook takvimleriyle çift yönlü senkronizasyon"
                        : "Two-way synchronization with Google and Outlook calendars"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                    <span>
                      {locale === "tr"
                        ? "Kendi özel alan adınız (CNAME) ve otomatik SSL"
                        : "Your custom domain (CNAME) with automated SSL"}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Right Column: Interactive Live Booking Preview */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-[#26282e] bg-[#18191d] p-5 shadow-2xl sm:p-6">
                  {/* Specialist Selector Tabs */}
                  <div className="flex items-center justify-between border-b border-[#26282e] pb-4">
                    <span className="text-xs font-medium text-[#9CA3AF]">
                      {locale === "tr" ? "Uzman Seçimi:" : "Specialist:"}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {profiles.map((p, idx) => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => setSelectedProfileIndex(idx)}
                          className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                            idx === selectedProfileIndex
                              ? "bg-[#26282e] text-[#F4F4F2]"
                              : "text-[#9CA3AF] hover:text-[#F4F4F2]"
                          }`}>
                          {p.avatar}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active Specialist Card */}
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-[#F4F4F2]">{activeProfile.name}</h2>
                      <p className="text-xs text-[#9CA3AF]">
                        {activeProfile.specialty} · {activeProfile.service}
                      </p>
                    </div>
                    <span className="rounded-full border border-emerald-900/60 bg-emerald-950/40 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                      {locale === "tr" ? "Randevuya Açık" : "Accepting Bookings"}
                    </span>
                  </div>

                  {/* Duration Selector */}
                  <div className="mt-5">
                    <span className="text-xs font-medium text-[#9CA3AF]">
                      {locale === "tr" ? "Görüşme Süresi" : "Session Duration"}
                    </span>
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {durations.map((dur, dIdx) => (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => setSelectedDurationIndex(dIdx)}
                          className={`rounded-lg border py-2 text-center text-xs font-medium transition ${
                            dIdx === selectedDurationIndex
                              ? "border-zinc-500 bg-[#26282e] text-[#F4F4F2]"
                              : "border-[#26282e] bg-[#111214] text-[#9CA3AF] hover:border-zinc-700"
                          }`}>
                          {dur}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Calendar Dates Grid */}
                  <div className="mt-5 rounded-xl border border-[#26282e] bg-[#111214] p-3.5">
                    <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                      <span className="font-medium text-[#F4F4F2]">
                        {locale === "tr" ? "Mayıs 2026" : "May 2026"}
                      </span>
                      <span>{locale === "tr" ? "Müsait Günler" : "Available Days"}</span>
                    </div>

                    <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8">
                      {AVAILABLE_DAYS.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setSelectedDay(day)}
                          className={`flex flex-col items-center justify-center rounded-md py-1.5 text-xs transition ${
                            day === selectedDay
                              ? "bg-[#F4F4F2] font-semibold text-[#111214]"
                              : "bg-[#18191d] text-[#9CA3AF] hover:bg-[#26282e] hover:text-[#F4F4F2]"
                          }`}>
                          <span>{day}</span>
                        </button>
                      ))}
                    </div>

                    {/* Time Slot Picker */}
                    <div className="mt-3 border-t border-[#26282e] pt-3">
                      <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                        <span>{locale === "tr" ? "Saat Dilimi" : "Available Times"}</span>
                        <span>{locale === "tr" ? "İstanbul (GMT+3)" : "Timezone (GMT+3)"}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                              slot === selectedTime
                                ? "border border-zinc-400 bg-[#26282e] text-[#F4F4F2]"
                                : "border border-[#26282e] bg-[#18191d] text-[#9CA3AF] hover:border-zinc-700 hover:text-[#F4F4F2]"
                            }`}>
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Simulated Booking & WhatsApp Confirmation Notification */}
                  <div className="mt-4 rounded-xl border border-[#26282e] bg-[#111214] p-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        <span>
                          {isSimulatedVerified
                            ? locale === "tr"
                              ? "SMS ile Doğrulandı"
                              : "Verified via SMS"
                            : locale === "tr"
                              ? "SMS Kodu Bekleniyor"
                              : "Awaiting SMS Code"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsSimulatedVerified(!isSimulatedVerified)}
                        className="text-[11px] text-[#9CA3AF] underline hover:text-[#F4F4F2]">
                        {locale === "tr" ? "Durumu Değiştir" : "Toggle State"}
                      </button>
                    </div>

                    {/* Simulated WhatsApp Preview Bubble */}
                    <div className="mt-2.5 rounded-lg border border-emerald-950/60 bg-[#16221c] p-2.5 text-xs text-emerald-200">
                      <div className="flex items-center gap-1.5 font-medium text-emerald-300">
                        <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{locale === "tr" ? "WhatsApp Teyit Mesajı" : "WhatsApp Confirmation"}</span>
                      </div>
                      <p className="mt-1 leading-relaxed text-[11px] text-emerald-100/90">
                        {locale === "tr"
                          ? `Randevunuz onaylandı: ${activeProfile.name} ile ${selectedDay} Mayıs 2026, ${selectedTime} (${durations[selectedDurationIndex]}). Takviminize eklendi.`
                          : `Appointment confirmed: ${activeProfile.name} on May ${selectedDay}, 2026 at ${selectedTime} (${durations[selectedDurationIndex]}). Synced to calendar.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SCREEN 2: İŞ AKIŞI VE TEMEL ÖZELLİKLER (WORKFLOW & FEATURES)
            ========================================================= */}
        <section
          aria-labelledby="features-title"
          className="relative border-b border-[#26282e] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold text-[#9CA3AF]">
                {locale === "tr" ? "İş Akışı ve Özellikler" : "Workflow & Core Capabilities"}
              </span>
              <h2
                id="features-title"
                className="mt-3 text-2xl font-bold tracking-tight text-[#F4F4F2] sm:text-3xl">
                {locale === "tr"
                  ? "Randevu sürecini baştan sona koruyan araçlar."
                  : "Reliable tools safeguarding your entire booking cycle."}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#9CA3AF] sm:text-base">
                {locale === "tr"
                  ? "SMS doğrulaması, WhatsApp bildirimleri, Google ve Outlook takvim entegrasyonu tek bir sistemde buluşuyor."
                  : "SMS verification, automated WhatsApp alerts, and two-way calendar sync working seamlessly together."}
              </p>
            </div>

            {/* 4 Bento Feature Cards */}
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Feature 1: WhatsApp & SMS */}
              <div className="flex flex-col justify-between rounded-2xl border border-[#26282e] bg-[#18191d] p-6 transition hover:border-zinc-700">
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-800/40 bg-emerald-950/40 text-emerald-400">
                    <Smartphone className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[#F4F4F2]">
                    {locale === "tr"
                      ? "SMS Doğrulaması ve WhatsApp Bildirimleri"
                      : "SMS Verification & WhatsApp Alerts"}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#9CA3AF]">
                    {locale === "tr"
                      ? "Danışan randevusunu oluştururken tek kullanımlık SMS koduyla numarasını doğrular. Sahte kayıtlar elenir; onay ve randevu öncesi hatırlatmalar WhatsApp üzerinden anında iletilir."
                      : "Clients verify their mobile number with a one-time SMS passcode. Invalid bookings are eliminated, while confirmations and reminder messages are sent straight to WhatsApp."}
                  </p>
                </div>

                <div className="mt-6 rounded-xl border border-[#26282e] bg-[#111214] p-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#F4F4F2]">
                      {locale === "tr" ? "SMS Güvenlik Protokolü" : "SMS Security Protocol"}
                    </span>
                    <span className="text-emerald-400">
                      {locale === "tr" ? "Aktif · Sahte Kayıt Yok" : "Active · Zero Spam"}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-[#9CA3AF]">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                    <span>
                      {locale === "tr"
                        ? "OTP Doğrulama Kodu: 481-920 (Zaman Aşımı: 180 sn)"
                        : "OTP Verification Code: 481-920 (Expires: 180s)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature 2: Calendar Synchronization */}
              <div className="flex flex-col justify-between rounded-2xl border border-[#26282e] bg-[#18191d] p-6 transition hover:border-zinc-700">
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-800/40 bg-sky-950/40 text-sky-400">
                    <RefreshCw className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[#F4F4F2]">
                    {locale === "tr"
                      ? "Google ve Outlook Çift Yönlü Takvim Senkronizasyonu"
                      : "Two-Way Google & Outlook Calendar Sync"}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#9CA3AF]">
                    {locale === "tr"
                      ? "Kişisel Google veya Microsoft Outlook takvimlerinizi bağlayın. Takviminizdeki kişisel planlar randevu sayfanızdaki saatleri otomatik kapatır; yeni randevular ise anında takviminize işlenir."
                      : "Link your personal Google or Outlook calendars. Personal appointments automatically block booking availability, and new client reservations appear immediately in your schedule."}
                  </p>
                </div>

                <div className="mt-6 rounded-xl border border-[#26282e] bg-[#111214] p-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#F4F4F2]">
                      {locale === "tr" ? "Çakışma Koruması" : "Conflict Guard"}
                    </span>
                    <span className="text-sky-400">
                      {locale === "tr" ? "Gerçek Zamanlı Eşitlendi" : "Real-time Synced"}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-[#9CA3AF]">
                    <CalendarIcon className="h-4 w-4 text-sky-400" aria-hidden="true" />
                    <span>
                      {locale === "tr"
                        ? "Google Calendar & Outlook Takvimi eşzamanlı aktif"
                        : "Google Calendar & Outlook simultaneously active"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature 3: Custom Domain (CNAME) */}
              <div className="flex flex-col justify-between rounded-2xl border border-[#26282e] bg-[#18191d] p-6 transition hover:border-zinc-700">
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-800/40 bg-indigo-950/40 text-indigo-400">
                    <Globe className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[#F4F4F2]">
                    {locale === "tr"
                      ? "Özel Alan Adı (CNAME) ve Marka Kimliği"
                      : "Custom Domain (CNAME) & Brand Identity"}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#9CA3AF]">
                    {locale === "tr"
                      ? "Randevu sayfanızı doğrudan kendi web adresiniz altında çalıştırın: randevu.siteniz.com. Ücretsiz SSL sertifikası ile güvenli ve profesyonel bir duruş sergileyin."
                      : "Host your booking portal on your own web address: booking.yourdomain.com. Establish institutional trust with automatic SSL encryption and a clean presence."}
                  </p>
                </div>

                <div className="mt-6 rounded-xl border border-[#26282e] bg-[#111214] p-3.5">
                  <div className="flex items-center gap-2 text-xs">
                    <Lock className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                    <span className="font-mono text-zinc-300">https://randevu.kliniginiz.com</span>
                    <span className="ml-auto rounded bg-emerald-950/60 px-2 py-0.5 text-[10px] text-emerald-400">
                      SSL Aktif
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature 4: Out of Office / Leaves */}
              <div className="flex flex-col justify-between rounded-2xl border border-[#26282e] bg-[#18191d] p-6 transition hover:border-zinc-700">
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-800/40 bg-amber-950/40 text-amber-400">
                    <Clock className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[#F4F4F2]">
                    {locale === "tr" ? "Ofis Dışı / İzinlerim Yönetimi" : "Out of Office & Leave Scheduling"}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#9CA3AF]">
                    {locale === "tr"
                      ? "Resmi tatiller, seminerler veya yıllık izinleriniz için çalışma saatlerinizi tek tıkla randevulara kapatın. Düzenli çalışma şablonunuzu bozmadan esnek takvim planı yapın."
                      : "Block availability for public holidays, conferences, or personal leaves in one click. Maintain your core working template without manual calendar adjustments."}
                  </p>
                </div>

                <div className="mt-6 rounded-xl border border-[#26282e] bg-[#111214] p-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#9CA3AF]">
                      {locale === "tr" ? "Planlı İzin Aralığı" : "Scheduled Leave Window"}
                    </span>
                    <span className="font-medium text-amber-400">
                      {locale === "tr" ? "Kilitli / Randevuya Kapalı" : "Blocked / Unavailable"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#F4F4F2]">
                    {locale === "tr"
                      ? "15 Temmuz - 18 Temmuz · Yıllık İzin (Otomatik Engellendi)"
                      : "July 15 - July 18 · Annual Leave (Auto Blocked)"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SCREEN 3: CANLI RANDEVU AKIŞI (STEP-BY-STEP LIVE FLOW)
            ========================================================= */}
        <section
          aria-labelledby="flow-title"
          className="relative border-b border-[#26282e] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <span className="text-xs font-semibold text-[#9CA3AF]">
                {locale === "tr" ? "Adım Adım Çalışma Akışı" : "Step-by-Step Experience"}
              </span>
              <h2
                id="flow-title"
                className="mt-3 text-2xl font-bold tracking-tight text-[#F4F4F2] sm:text-3xl">
                {locale === "tr"
                  ? "Talepten teyide pürüzsüz randevu akışı."
                  : "A seamless journey from booking to confirmation."}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#9CA3AF] sm:text-base">
                {locale === "tr"
                  ? "Danışanınız linkinize tıklar, saatini seçer ve SMS ile teyit eder. Tüm süreç otomatik tamamlanır."
                  : "Your client opens your link, selects an open time, and confirms via SMS. The entire flow completes automatically."}
              </p>
            </div>

            {/* 4 Interactive Process Steps */}
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Step 1 */}
              <div className="relative rounded-2xl border border-[#26282e] bg-[#18191d] p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-md border border-[#26282e] bg-[#111214] px-2.5 py-1 text-xs font-semibold text-[#F4F4F2]">
                    01
                  </span>
                  <Clock className="h-4 w-4 text-[#9CA3AF]" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-[#F4F4F2]">
                  {locale === "tr" ? "Müsaitliği Belirle" : "Set Availability"}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#9CA3AF]">
                  {locale === "tr"
                    ? "Haftalık çalışma saatlerinizi, randevu sürelerinizi ve seanslar arası dinlenme tamponlarını tanımlayın."
                    : "Define your weekly working hours, appointment lengths, and buffer periods between sessions."}
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative rounded-2xl border border-[#26282e] bg-[#18191d] p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-md border border-[#26282e] bg-[#111214] px-2.5 py-1 text-xs font-semibold text-[#F4F4F2]">
                    02
                  </span>
                  <Globe className="h-4 w-4 text-[#9CA3AF]" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-[#F4F4F2]">
                  {locale === "tr" ? "Linkini Paylaş" : "Share Your Link"}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#9CA3AF]">
                  {locale === "tr"
                    ? "Özel randevu bağlantınızı Instagram bio'nuza, web sitenize veya WhatsApp durumunuza ekleyin."
                    : "Place your custom booking link in your Instagram bio, company website, or WhatsApp status."}
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative rounded-2xl border border-[#26282e] bg-[#18191d] p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-md border border-[#26282e] bg-[#111214] px-2.5 py-1 text-xs font-semibold text-emerald-400">
                    03
                  </span>
                  <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-[#F4F4F2]">
                  {locale === "tr" ? "SMS Teyidi Al" : "SMS Verification"}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#9CA3AF]">
                  {locale === "tr"
                    ? "Danışan tek kullanımlık SMS koduyla numarasını doğrular. Asılsız ve mükerrer talepler engellenir."
                    : "The client verifies their mobile number with a one-time SMS passcode, preventing ghost bookings."}
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative rounded-2xl border border-[#26282e] bg-[#18191d] p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-md border border-[#26282e] bg-[#111214] px-2.5 py-1 text-xs font-semibold text-sky-400">
                    04
                  </span>
                  <MessageCircle className="h-4 w-4 text-sky-400" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-[#F4F4F2]">
                  {locale === "tr" ? "Takvim & WhatsApp" : "Sync & Remind"}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#9CA3AF]">
                  {locale === "tr"
                    ? "Randevu takviminize işlenir; görüşme öncesinde hem size hem danışana WhatsApp bildirimi iletilir."
                    : "The appointment syncs to your calendar; automated WhatsApp reminders go out before the session."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SCREEN 4: SSS AKORDEONU (FAQ ACCORDION)
            ========================================================= */}
        <section
          aria-labelledby="faq-title"
          className="relative border-b border-[#26282e] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <span className="text-xs font-semibold text-[#9CA3AF]">
                {locale === "tr" ? "Sıkça Sorulan Sorular" : "Frequently Asked Questions"}
              </span>
              <h2
                id="faq-title"
                className="mt-3 text-2xl font-bold tracking-tight text-[#F4F4F2] sm:text-3xl">
                {locale === "tr" ? "Merak Edilen Sorular ve Cevaplar" : "Clear Answers to Common Questions"}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#9CA3AF]">
                {locale === "tr"
                  ? "rOndevu özellikleri, takvim senkronizasyonu ve kurulum süreci hakkında ayrıntılı bilgi."
                  : "Everything you need to know about rOndevu capabilities, calendar sync, and activation."}
              </p>
            </div>

            {/* Accordion Items */}
            <div className="mt-10 divide-y divide-[#26282e] border-y border-[#26282e]">
              {faqItems.map((item, index) => {
                const isOpen = openFaqIndex === index;
                const questionId = `${baseFaqId}-q-${index}`;
                const answerId = `${baseFaqId}-a-${index}`;

                return (
                  <div key={item.q} className="py-4">
                    <button
                      type="button"
                      id={questionId}
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="flex w-full items-center justify-between text-left text-base font-medium text-[#F4F4F2] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400">
                      <span className="pr-4">{item.q}</span>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#26282e] bg-[#18191d] text-[#9CA3AF]">
                        {isOpen ? (
                          <Minus className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Plus className="h-4 w-4" aria-hidden="true" />
                        )}
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        id={answerId}
                        role="region"
                        aria-labelledby={questionId}
                        className="mt-3 pr-8 text-sm leading-relaxed text-[#9CA3AF]">
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            SCREEN 5: CTA / KAPANIŞ KARTI (CALL TO ACTION)
            ========================================================= */}
        <section aria-labelledby="cta-title" className="relative px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-3xl border border-[#26282e] bg-[#18191d] p-8 text-center sm:p-12">
            <h2 id="cta-title" className="text-2xl font-bold tracking-tight text-[#F4F4F2] sm:text-3xl">
              {locale === "tr"
                ? "Randevularınızı düzene sokun, zamanınızı işinize ayırın."
                : "Bring order to your schedule and focus on your practice."}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#9CA3AF] sm:text-base">
              {locale === "tr"
                ? "SMS doğrulaması, WhatsApp bildirimleri ve çift yönlü takvim eşitlemesi ile profesyonel randevu deneyimine bugün başlayın."
                : "Start delivering a premium scheduling experience today with verified SMS, WhatsApp alerts, and two-way calendar sync."}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={pricingHref}
                className="inline-flex min-h-[46px] items-center justify-center rounded-lg bg-[#F4F4F2] px-6 text-sm font-semibold text-[#111214] transition hover:bg-white active:scale-[0.98]">
                {locale === "tr" ? "Planları İnceleyin" : "View Plans"}
              </Link>

              <button
                type="button"
                onClick={() => setModalPlanType("general")}
                className="inline-flex min-h-[46px] items-center justify-center rounded-lg border border-[#26282e] bg-[#111214] px-5 text-sm font-semibold text-[#F4F4F2] transition hover:border-[#3a3d46] hover:bg-[#1f2127] active:scale-[0.98]">
                <MessageCircle className="mr-2 h-4 w-4 text-emerald-400" aria-hidden="true" />
                {locale === "tr" ? "WhatsApp ile Bilgi Alın" : "Inquire via WhatsApp"}
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 2. Marketing Footer */}
      <MarketingFooter locale={locale} initialContact={resolvedContact} />

      {/* 3. Dynamic Plan Contact Modal */}
      <PlanContactModal
        isOpen={!!modalPlanType}
        planType={modalPlanType === "general" ? null : modalPlanType}
        locale={locale}
        phone={phone}
        email={email}
        whatsapp={whatsapp}
        onClose={handleModalClose}
      />
    </div>
  );
}

export type { HomeViewProps };
export { HomeView };
export default HomeView;
