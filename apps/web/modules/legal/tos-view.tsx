"use client";

import { APP_NAME } from "@calcom/lib/constants";
import type { PlanContactConfig } from "@calcom/lib/planContactConfig";
import { trpc } from "@calcom/trpc/react";
import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  CheckCircle2,
  FileText,
  Globe,
  Layers,
  Mail,
  MessageCircle,
  Phone,
  Scale,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MarketingFooter } from "../home/components/MarketingFooter";
import { MarketingHeader } from "../home/components/MarketingHeader";

const DEFAULT_SUPPORT_EMAIL = "destek@rondevu.org";
const DEFAULT_SUPPORT_PHONE = "0552 119 19 87";
const DEFAULT_SUPPORT_WHATSAPP = "905521191987";

const TOC_ITEMS = [
  { id: "giris", label: "Giriş ve Genel Esaslar" },
  { id: "kapsam", label: "1. Hizmet Kapsamı ve Aktivasyon" },
  { id: "randevular", label: "2. Randevular ve Bağlı Hizmetler" },
  { id: "anti-spam", label: "3. Kabul Edilebilir Kullanım ve Anti-Spam" },
  { id: "fikri-mulkiyet", label: "4. Fikri Mülkiyet ve İletişim" },
];

function LegalBackgroundGrid() {
  const rows = 8;
  const cols = 18;
  const size = 60;
  const gap = 8;
  const radius = 8;
  const width = cols * size + (cols - 1) * gap;
  const height = rows * size + (rows - 1) * gap;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 flex justify-center overflow-hidden opacity-40 dark:opacity-25">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        className="[--grid-fill:#f4f4f5] [--grid-stroke:rgba(34,42,53,0.06)] dark:[--grid-fill:#18181b] dark:[--grid-stroke:rgba(255,255,255,0.04)]">
        <defs>
          <radialGradient id="tosGridFade" cx="50%" cy="30%" rx="60%" ry="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="tosGridMask">
            <rect width={width} height={height} fill="url(#tosGridFade)" />
          </mask>
        </defs>
        <g mask="url(#tosGridMask)">
          {Array.from({ length: rows * cols }).map((_, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = col * (size + gap);
            const y = row * (size + gap);
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={size}
                height={size}
                rx={radius}
                fill="var(--grid-fill)"
                stroke="var(--grid-stroke)"
                strokeWidth="1"
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

interface TosViewProps {
  initialContact?: PlanContactConfig;
}

export function TosView({ initialContact }: TosViewProps = {}) {
  const { data: contactConfig } = trpc.viewer.public.getPlanContact.useQuery(undefined, {
    staleTime: 30000,
  });

  const resolvedContact = contactConfig ?? initialContact;
  const email = resolvedContact?.email || DEFAULT_SUPPORT_EMAIL;
  const rawPhone = resolvedContact?.phone;
  const phone = rawPhone && rawPhone !== "0850 000 00 00" ? rawPhone : DEFAULT_SUPPORT_PHONE;
  const cleanPhone = phone.replace(/[^\d+]/g, "");
  const rawWhatsapp = resolvedContact?.whatsapp;
  const whatsapp = rawWhatsapp && rawWhatsapp !== "908500000000" ? rawWhatsapp : DEFAULT_SUPPORT_WHATSAPP;
  const cleanWhatsapp = whatsapp.replace(/[^\d]/g, "");

  const [activeId, setActiveId] = useState<string>("giris");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0% -65% 0%", threshold: 0 }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-default text-emphasis selection:bg-brand-default selection:text-brand flex flex-col">
      <MarketingHeader locale="tr" />

      <div className="relative flex-1">
        <LegalBackgroundGrid />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          {/* Breadcrumb / Geri Bağlantısı */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-subtle transition-colors hover:text-emphasis">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Ana Sayfaya Dön</span>
            </Link>
          </div>

          {/* Hero Başlık Alanı */}
          <header className="mb-12 border-b border-subtle pb-8">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-subtle bg-muted/40 px-3 py-1 font-medium text-subtle text-xs">
              <FileText className="h-3.5 w-3.5 text-emphasis" aria-hidden="true" />
              <span>Hizmet kullanımı hakkında</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-emphasis sm:text-4xl">
              Kullanım Koşulları
            </h1>
            <p className="mt-2 text-xs text-subtle">Son güncelleme: 14 Kasım 2026</p>
          </header>

          {/* İki Kolonlu Gövde: Sol Sticky TOC, Sağ <72ch Metin Akışı */}
          <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-12 xl:gap-16 items-start">
            {/* Sol Sticky TOC (Masaüstü) */}
            <aside className="hidden lg:block sticky top-24 self-start space-y-4">
              <p className="text-xs font-medium text-subtle">İçindekiler</p>
              <nav aria-label="Sayfa içi gezinme" className="space-y-1">
                {TOC_ITEMS.map((item) => {
                  const isActive = activeId === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-muted/60 text-emphasis font-semibold border-l-2 border-emphasis"
                          : "text-subtle hover:bg-muted/30 hover:text-emphasis"
                      }`}>
                      {item.label}
                    </a>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-subtle">
                <p className="text-[11px] text-muted leading-relaxed">
                  Sorularınız için:{" "}
                  <a href={`mailto:${email}`} className="text-emphasis underline-offset-2 hover:underline">
                    {email}
                  </a>
                </p>
              </div>
            </aside>

            {/* Mobil Hızlı Gezinme */}
            <div className="lg:hidden mb-8 overflow-x-auto pb-2 scrollbar-none">
              <nav aria-label="Mobil sayfa içi gezinme" className="flex gap-2">
                {TOC_ITEMS.map((item) => {
                  const isActive = activeId === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`shrink-0 rounded-full border px-3 py-1 text-xs transition-colors ${
                        isActive
                          ? "border-emphasis bg-muted/60 text-emphasis font-medium"
                          : "border-subtle bg-muted/20 text-subtle hover:text-emphasis"
                      }`}>
                      {item.label}
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Metin Akışı - Okuma Konforu için <72ch */}
            <main className="min-w-0 max-w-[72ch] space-y-10">
              {/* Giriş */}
              <section id="giris" className="scroll-mt-24 space-y-4">
                <p className="text-sm leading-relaxed text-subtle sm:text-base sm:leading-relaxed">
                  Bu koşullar, <strong>{APP_NAME}</strong> (<code>https://rondevu.org</code>) üzerinden hesap
                  açılması, randevu sayfası oluşturulması ve randevu alınmasıyla ilgili temel kullanım
                  kurallarını açıklar. Hesap sahipleri, kendi randevu sayfalarındaki içerikten, hesap erişim
                  güvenliğinden ve sundukları hizmetlerden sorumludur.
                </p>
              </section>

              {/* 1. Hizmetin Niteliği ve Kapsamı */}
              <section id="kapsam" className="scroll-mt-24 space-y-4 pt-6 border-t border-subtle">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-emphasis" aria-hidden="true" />
                  <h2 className="font-semibold text-lg text-emphasis sm:text-xl tracking-tight">
                    1. Hizmetin Kapsamı ve Hesap Aktivasyonu
                  </h2>
                </div>
                <p className="text-sm leading-relaxed text-subtle">
                  {APP_NAME}, hesap sahiplerinin müsaitliklerini yönetmesine ve katılımcıların çevrimiçi
                  randevu oluşturmasına yardımcı olan bir yazılım hizmetidir. Bildirim, SMS doğrulaması,
                  görüşme bağlantısı ve takvim eşitleme gibi işlevler aktif plan kapsamına ve hesap ayarlarına
                  göre sunulur. Güncel plan detayları{" "}
                  <Link href="/pricing" className="text-emphasis underline-offset-2 hover:underline">
                    Fiyatlandırma
                  </Link>{" "}
                  ve{" "}
                  <Link href="/plan-bilgi" className="text-emphasis underline-offset-2 hover:underline">
                    İletişim &amp; Aktivasyon
                  </Link>{" "}
                  sayfalarında yer alır.
                </p>
                <div className="rounded-xl border border-subtle bg-muted/20 p-4 sm:p-5 text-xs sm:text-sm leading-relaxed text-subtle">
                  Randevuya konu olan hizmetin açıklaması, ücreti, iptal koşulları ve yerine getirilmesi
                  randevu sahibi tarafından katılımcıya bildirilmelidir. Platformdaki randevu kaydı, bu
                  hizmetin sunulduğunu veya sonucunu garanti etmez.
                </div>
              </section>

              {/* 2. Randevular ve Bağlı Hizmetler */}
              <section id="randevular" className="scroll-mt-24 space-y-4 pt-6 border-t border-subtle">
                <div className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-emphasis" aria-hidden="true" />
                  <h2 className="font-semibold text-lg text-emphasis sm:text-xl tracking-tight">
                    2. Randevular ve Bağlı Hizmetler
                  </h2>
                </div>
                <p className="text-sm leading-relaxed text-subtle">
                  Randevu akışını kullanırken aşağıdaki hususları dikkate alınız:
                </p>
                <ul className="space-y-3 text-sm text-subtle">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" aria-hidden="true" />
                    <span>
                      <strong className="text-emphasis">Katılım ve iptal:</strong> Randevu sahibi ve
                      katılımcı, randevuya katılma, yeniden planlama ve iptal konularında kendi aralarında
                      doğrudan iletişim kurar.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" aria-hidden="true" />
                    <span>
                      <strong className="text-emphasis">Bildirimler:</strong> SMS, WhatsApp (Evolution API) ve
                      e-posta bildirim iletileri harici sağlayıcıların operasyonel durumlarına ve ağ
                      bağlantılarına bağlıdır. Bildirim gecikirse randevu bilgilerini panelinizden veya onay
                      bağlantınızdan teyit ediniz.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" aria-hidden="true" />
                    <span>
                      <strong className="text-emphasis">Hizmet koşulları:</strong> Randevu sahibinin sunduğu
                      hizmete ilişkin fiyat, ödeme ve iade bilgileri ilgili hizmet sahibi tarafından
                      açıklanır.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" aria-hidden="true" />
                    <span>
                      <strong className="text-emphasis">Entegrasyonlar:</strong> Takvim, WhatsApp (Evolution
                      API) ve görüşme sağlayıcılarında yaşanabilecek bölgesel kesintiler eşitlemeyi, bildirim
                      iletimini veya toplantı odalarının oluşturulmasını etkileyebilir.
                    </span>
                  </li>
                </ul>
              </section>

              {/* 3. Kabul Edilebilir Kullanım ve Anti-Spam Politikası */}
              <section id="anti-spam" className="scroll-mt-24 space-y-4 pt-6 border-t border-subtle">
                <div className="flex items-center gap-2">
                  <Ban className="h-5 w-5 text-emphasis" aria-hidden="true" />
                  <h2 className="font-semibold text-lg text-emphasis sm:text-xl tracking-tight">
                    3. Kabul Edilebilir Kullanım ve Anti-Spam Politikası
                  </h2>
                </div>
                <p className="text-sm leading-relaxed text-subtle">
                  Randevu sayfaları ve bildirim özellikleri meşru randevu organizasyonu ve danışan iletişimi
                  için kullanılmalıdır.
                </p>
                <div className="space-y-3">
                  <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-4 sm:p-5 text-xs sm:text-sm leading-relaxed text-subtle dark:border-red-500/30">
                    <div className="flex items-center gap-2 font-medium text-emphasis text-sm">
                      <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" aria-hidden="true" />
                      <span>Kesinlikle Yasaklanmış Faaliyetler:</span>
                    </div>
                    <ul className="mt-3 list-inside list-disc space-y-1.5 text-xs sm:text-sm">
                      <li>
                        SMS, WhatsApp veya e-posta servislerini izinsiz ticari reklam, promosyon veya toplu
                        pazarlama (spam) amacıyla kullanmak,
                      </li>
                      <li>
                        Kişilerin rızası olmaksızın telefon numaralarına mükerrer OTP kodu veya rahatsız edici
                        mesaj gönderimi tetiklemek,
                      </li>
                      <li>
                        Sistemi taciz, dolandırıcılık, sahte kimlik oluşturma veya üçüncü şahısların itibarını
                        zedeleme amacıyla kullanmak,
                      </li>
                      <li>
                        Başkalarının hesaplarına yetkisiz erişmeye çalışmak, otomatik veri çekme (scraping)
                        yapmak veya hizmeti aşırı isteklerle kesintiye uğratmak.
                      </li>
                    </ul>
                  </div>
                  <p className="text-xs text-subtle">
                    Kuralları ihlal eden veya bildirim sistemini kötüye kullanan hesapların erişimi derhal
                    sınırlandırılabilir. Şüpheli durumları bildirmek veya destek almak için aşağıdaki iletişim
                    kanallarını kullanabilirsiniz.
                  </p>
                </div>
              </section>

              {/* 4. Fikri Mülkiyet, Kullanım Sınırları ve İletişim */}
              <section id="fikri-mulkiyet" className="scroll-mt-24 space-y-4 pt-6 border-t border-subtle">
                <h2 className="font-semibold text-lg text-emphasis sm:text-xl tracking-tight">
                  4. Fikri Mülkiyet, Kullanım Sınırları ve İletişim
                </h2>
                <p className="text-sm leading-relaxed text-subtle">
                  {APP_NAME} platformu, marka adı, logosu, alan adı, arayüz tasarımları ve özel yazılım
                  bileşenleri üzerindeki tüm fikri ve sınai mülkiyet hakları {APP_NAME}&apos;ya aittir (alt
                  bileşenlerde yer alan üçüncü taraf açık kaynak lisans hükümleri saklıdır). Kullanıcılar
                  hizmeti yalnızca aktif hesap kapsamındaki bireysel veya kurumsal randevu yönetimi amacıyla
                  kullanabilir; platform unsurları izinsiz kopyalanamaz, yeniden markalanamaz veya üçüncü
                  kişilere yeniden satılamaz. Bu koşullar güncellendiğinde güncel metin ve tarih bu sayfada
                  yayımlanır.
                </p>

                <div className="mt-6 rounded-xl border border-subtle bg-muted/15 p-4 sm:p-5">
                  <p className="text-xs font-semibold text-emphasis">Destek ve Hukuki İletişim Kanalları</p>
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2 text-xs">
                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-2 rounded-lg border border-subtle/80 bg-default/60 p-2.5 text-emphasis transition-colors hover:border-emphasis hover:bg-muted/30">
                      <Mail className="h-4 w-4 text-subtle shrink-0" aria-hidden="true" />
                      <span className="truncate">{email}</span>
                    </a>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="flex items-center gap-2 rounded-lg border border-subtle/80 bg-default/60 p-2.5 text-emphasis transition-colors hover:border-emphasis hover:bg-muted/30">
                      <Phone className="h-4 w-4 text-subtle shrink-0" aria-hidden="true" />
                      <span>{phone}</span>
                    </a>
                    <a
                      href={`https://wa.me/${cleanWhatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-subtle/80 bg-default/60 p-2.5 text-emphasis transition-colors hover:border-emphasis hover:bg-muted/30">
                      <MessageCircle className="h-4 w-4 text-subtle shrink-0" aria-hidden="true" />
                      <span>WhatsApp Destek</span>
                    </a>
                    <Link
                      href="/plan-bilgi"
                      className="flex items-center gap-2 rounded-lg border border-subtle/80 bg-default/60 p-2.5 text-emphasis transition-colors hover:border-emphasis hover:bg-muted/30">
                      <Globe className="h-4 w-4 text-subtle shrink-0" aria-hidden="true" />
                      <span className="truncate">İletişim &amp; Aktivasyon</span>
                    </Link>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>

      <MarketingFooter locale="tr" initialContact={resolvedContact} />
    </div>
  );
}
