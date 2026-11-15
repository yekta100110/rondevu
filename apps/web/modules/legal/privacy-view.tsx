"use client";

import { APP_NAME } from "@calcom/lib/constants";
import type { PlanContactConfig } from "@calcom/lib/planContactConfig";
import { trpc } from "@calcom/trpc/react";
import {
  ArrowLeft,
  CheckCircle2,
  Cookie,
  Database,
  Globe,
  Mail,
  MessageCircle,
  Network,
  Phone,
  Scale,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MarketingFooter } from "../home/components/MarketingFooter";
import { MarketingHeader } from "../home/components/MarketingHeader";

const DEFAULT_SUPPORT_EMAIL = "destek@rondevu.org";
const DEFAULT_SUPPORT_PHONE = "0552 119 19 87";
const DEFAULT_SUPPORT_WHATSAPP = "905521191987";

const TOC_ITEMS = [
  { id: "giris", label: "Giriş ve Veri Sorumlusu" },
  { id: "roller", label: "1. Hesap Sahibi ve Katılımcı Rolleri" },
  { id: "veri-kategorileri", label: "2. Veri Kategorileri ve Amaçları" },
  { id: "hukuki-sebepler", label: "3. Hukuki Sebepler (KVKK m. 5)" },
  { id: "cerezler", label: "4. Çerezler ve Oturum Kullanımı" },
  { id: "bagli-hizmetler", label: "5. Bağlı Hizmetler ve Veri Aktarımı" },
  { id: "saklama-ve-haklar", label: "6. Saklama Süresi ve KVKK Hakları" },
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
          <radialGradient id="privacyGridFade" cx="50%" cy="30%" rx="60%" ry="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="privacyGridMask">
            <rect width={width} height={height} fill="url(#privacyGridFade)" />
          </mask>
        </defs>
        <g mask="url(#privacyGridMask)">
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

interface PrivacyViewProps {
  initialContact?: PlanContactConfig;
}

export function PrivacyView({ initialContact }: PrivacyViewProps = {}) {
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
              <ShieldCheck className="h-3.5 w-3.5 text-emphasis" aria-hidden="true" />
              <span>6698 Sayılı KVKK Kapsamında Aydınlatma Metni</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-emphasis sm:text-4xl">
              Gizlilik Politikası ve KVKK Aydınlatma Metni
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
                  Veri sorumlusu irtibat:{" "}
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
              {/* Giriş ve Veri Sorumlusu */}
              <section id="giris" className="scroll-mt-24 space-y-4">
                <p className="text-sm leading-relaxed text-subtle sm:text-base sm:leading-relaxed">
                  Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) uyarınca{" "}
                  <strong>{APP_NAME}</strong> (<code>https://rondevu.org</code>) üzerinden sunulan çevrimiçi
                  randevu ve takvim yönetimi hizmetleri kapsamında kişisel verilerin işlenme amaçlarını,
                  hukuki sebeplerini, aktarım koşullarını ve ilgili kişi haklarını açıklamak amacıyla
                  hazırlanmıştır.
                </p>

                <div className="rounded-xl border border-subtle bg-muted/15 p-4 sm:p-5 text-xs sm:text-sm leading-relaxed text-subtle">
                  <p className="font-medium text-emphasis">Veri Sorumlusu İletişim Kanalları</p>
                  <p className="mt-1">
                    Platform: {APP_NAME} (<code>https://rondevu.org</code>)
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 text-xs">
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center gap-1.5 text-emphasis hover:underline">
                      <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{email}</span>
                    </a>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="inline-flex items-center gap-1.5 text-emphasis hover:underline">
                      <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{phone}</span>
                    </a>
                    <a
                      href={`https://wa.me/${cleanWhatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-emphasis hover:underline">
                      <MessageCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>WhatsApp İletişim</span>
                    </a>
                    <Link
                      href="/plan-bilgi"
                      className="inline-flex items-center gap-1.5 text-emphasis hover:underline">
                      <Globe className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">İletişim &amp; Aktivasyon</span>
                    </Link>
                  </div>
                </div>
              </section>

              {/* 1. Rol Ayrımı */}
              <section id="roller" className="scroll-mt-24 space-y-4 pt-6 border-t border-subtle">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-emphasis" aria-hidden="true" />
                  <h2 className="font-semibold text-lg text-emphasis sm:text-xl tracking-tight">
                    1. Hesap Sahibi ve Katılımcı Rolleri
                  </h2>
                </div>
                <p className="text-sm leading-relaxed text-subtle">
                  İşlenen kişisel veriler, hesap sahibinin etkinleştirdiği özelliklere ve randevu formunda
                  talep ettiği alanlara göre değişiklik gösterebilir.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-subtle bg-muted/20 p-4">
                    <h3 className="font-medium text-emphasis text-sm">
                      Hesap sahipleri (Uzmanlar &amp; İşletmeler)
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-subtle">
                      Hesap oluşturma, abonelik aktivasyonu ve takvim yönetimi sırasında ad, soyad, e-posta
                      adresi, telefon numarası, oturum bilgileri, müsaitlik tercihleri ve bağlı takvim
                      ayarları işlenir.
                    </p>
                  </div>
                  <div className="rounded-xl border border-subtle bg-muted/20 p-4">
                    <h3 className="font-medium text-emphasis text-sm">Randevu alan kişiler (Danışanlar)</h3>
                    <p className="mt-2 text-xs leading-relaxed text-subtle">
                      Randevu oluşturma sırasında paylaşılan ad, e-posta, telefon numarası, seçilen zaman
                      dilimi ve form yanıtları randevunun kurulması ve bildirimlerin iletilmesi için işlenir.
                      Hesap sahibi, kendi randevu sayfasında istediği ek alanlara ilişkin kendi aydınlatma
                      yükümlülüğünden sorumludur.
                    </p>
                  </div>
                </div>
              </section>

              {/* 2. İşlenen Kişisel Veri Kategorileri ve Amaçları */}
              <section id="veri-kategorileri" className="scroll-mt-24 space-y-4 pt-6 border-t border-subtle">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-emphasis" aria-hidden="true" />
                  <h2 className="font-semibold text-lg text-emphasis sm:text-xl tracking-tight">
                    2. İşlenen Kişisel Veri Kategorileri ve Amaçları
                  </h2>
                </div>
                <ul className="space-y-3 text-sm text-subtle">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" aria-hidden="true" />
                    <span>
                      <strong className="text-emphasis">
                        Kimlik ve İletişim Bilgileri (Ad, soyad, e-posta, telefon numarası):
                      </strong>{" "}
                      Hesap açılışı ve doğrulaması, katılımcının randevu sahibine bildirilmesi, SMS OTP
                      doğrulaması (etkinleştirildiğinde) ile e-posta, SMS ve WhatsApp üzerinden randevu onayı
                      ve hatırlatma iletilerinin gönderilmesi amacıyla işlenir.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" aria-hidden="true" />
                    <span>
                      <strong className="text-emphasis">
                        Randevu ve İşlem Bilgileri (Randevu zamanı, müsaitlik, form yanıtları):
                      </strong>{" "}
                      Uygun zaman aralıklarının hesaplanması, randevu oluşturma, yeniden planlama veya iptal
                      süreçlerinin yürütülmesi ve bağlı takvimlerle eşitleme yapılması için işlenir.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" aria-hidden="true" />
                    <span>
                      <strong className="text-emphasis">
                        İşlem Güvenliği ve Teknik Kayıtlar (IP adresi, tarayıcı/cihaz bilgisi, erişim
                        kayıtları):
                      </strong>{" "}
                      Hizmetin kesintisiz işletilmesi, oturum güvenliğinin sağlanması, hata incelemesi ve
                      kötüye kullanım ile yetkisiz erişim girişimlerinin önlenmesi amacıyla işlenir.
                    </span>
                  </li>
                </ul>
              </section>

              {/* 3. Kişisel Verilerin İşlenme Hukuki Sebepleri (KVKK m. 5) */}
              <section id="hukuki-sebepler" className="scroll-mt-24 space-y-4 pt-6 border-t border-subtle">
                <div className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-emphasis" aria-hidden="true" />
                  <h2 className="font-semibold text-lg text-emphasis sm:text-xl tracking-tight">
                    3. Kişisel Verilerin İşlenme Hukuki Sebepleri (KVKK m. 5)
                  </h2>
                </div>
                <p className="text-sm leading-relaxed text-subtle">
                  Kişisel verileriniz, KVKK&apos;nın 5. maddesinin 2. fıkrasında düzenlenen aşağıdaki hukuki
                  sebeplere dayanılarak otomatik veya kısmen otomatik yollarla işlenir:
                </p>
                <ul className="space-y-2.5 text-sm text-subtle">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" aria-hidden="true" />
                    <span>
                      <strong className="text-emphasis">
                        Sözleşmenin kurulması ve ifası (KVKK m. 5/2-c):
                      </strong>{" "}
                      Hesap aktivasyonu, randevu sayfasının işletilmesi, randevu kaydının oluşturulması ile
                      e-posta, SMS ve WhatsApp bildirimlerinin iletilmesi.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" aria-hidden="true" />
                    <span>
                      <strong className="text-emphasis">
                        Hukuki yükümlülüğün yerine getirilmesi (KVKK m. 5/2-ç):
                      </strong>{" "}
                      Yasal düzenlemelerden kaynaklanan kayıt tutma ve yetkili kurum taleplerinin
                      karşılanması.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" aria-hidden="true" />
                    <span>
                      <strong className="text-emphasis">
                        Bir hakkın tesisi, kullanılması veya korunması (KVKK m. 5/2-e):
                      </strong>{" "}
                      Randevu ve işlem kayıtlarına ilişkin olası uyuşmazlıklarda doğrulama sağlanması.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" aria-hidden="true" />
                    <span>
                      <strong className="text-emphasis">Meşru menfaat (KVKK m. 5/2-f):</strong> Temel hak ve
                      özgürlüklerinize zarar vermemek kaydıyla sistem güvenliği, anti-spam/OTP suistimal
                      koruması ve hata giderme çalışmaları.
                    </span>
                  </li>
                </ul>
                <p className="text-xs leading-relaxed text-subtle">
                  Yasal olarak açık rıza gerektiren isteğe bağlı entegrasyonlar veya özel tercihler söz konusu
                  olduğunda verileriniz KVKK m. 5/1 kapsamında açık rızanıza dayalı olarak işlenir.
                </p>
              </section>

              {/* 4. Çerezler ve Oturum Kullanımı */}
              <section id="cerezler" className="scroll-mt-24 space-y-4 pt-6 border-t border-subtle">
                <div className="flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-emphasis" aria-hidden="true" />
                  <h2 className="font-semibold text-lg text-emphasis sm:text-xl tracking-tight">
                    4. Çerezler (Cookies) ve Oturum Kullanımı
                  </h2>
                </div>
                <p className="text-sm leading-relaxed text-subtle">
                  {APP_NAME}, hizmetin temel işlevlerini yürütebilmek için yalnızca gerekli oturum ve tercih
                  çerezlerinden yararlanır. Üçüncü taraf reklam ağı veya davranışsal hedefleme çerezleri
                  kullanılmaz.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-subtle bg-muted/20 p-4">
                    <h3 className="font-medium text-emphasis text-sm">
                      Zorunlu Oturum ve Güvenlik Çerezleri
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-subtle">
                      Kullanıcı oturumunun sürdürülmesi, kimlik doğrulama güvenliği, CSRF koruması ile
                      Cloudflare ağ güvenliği/bot koruma kontrolleri için kullanılır.
                    </p>
                  </div>
                  <div className="rounded-xl border border-subtle bg-muted/20 p-4">
                    <h3 className="font-medium text-emphasis text-sm">İşlevsel Tercih Çerezleri</h3>
                    <p className="mt-2 text-xs leading-relaxed text-subtle">
                      Saat dilimi, arayüz dili ve tema tercihi (açık/koyu mod) gibi kullanıcı ayarlarını
                      hatırlamak amacıyla kullanılır. Tarayıcı ayarlarınız üzerinden çerezleri yönetebilir
                      veya silebilirsiniz.
                    </p>
                  </div>
                </div>
              </section>

              {/* 5. Bağlı Hizmetler ve Veri Aktarımı */}
              <section id="bagli-hizmetler" className="scroll-mt-24 space-y-4 pt-6 border-t border-subtle">
                <div className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-emphasis" aria-hidden="true" />
                  <h2 className="font-semibold text-lg text-emphasis sm:text-xl tracking-tight">
                    5. Bağlı Hizmetler ve Veri Aktarımı
                  </h2>
                </div>
                <p className="text-sm leading-relaxed text-subtle">
                  Kişisel verileriniz üçüncü kişilere satılmaz. Yalnızca kullanılan özelliklerin çalışabilmesi
                  için ilgili teknik sistemler, servis mimarisi ve iletişim sağlayıcılarıyla gereken asgari
                  düzeyde paylaşım yapılabilir:
                </p>
                <div className="space-y-3">
                  <div className="rounded-xl border border-subtle p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-emphasis text-sm">SMS / OTP Sağlayıcısı</span>
                      <span className="rounded bg-muted/40 px-2 py-0.5 text-xs text-subtle">
                        SMS &amp; OTP Servisi
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-subtle">
                      SMS doğrulaması veya randevu hatırlatması etkinleştirildiğinde telefon numarası ve
                      iletim için gereken mesaj bilgisi yalnızca gönderimin gerçekleştirilmesi amacıyla SMS
                      sağlayıcısına iletilir.
                    </p>
                  </div>

                  <div className="rounded-xl border border-subtle p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-emphasis text-sm">
                        WhatsApp Bildirim Sistemi (Evolution API)
                      </span>
                      <span className="rounded bg-muted/40 px-2 py-0.5 text-xs text-subtle">
                        WhatsApp Bildirimleri
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-subtle">
                      WhatsApp üzerinden randevu onayı veya hatırlatma gönderimi etkinleştirildiğinde telefon
                      numarası ve randevu bildirim içeriği yalnızca mesajın iletilmesi amacıyla Evolution API
                      mesajlaşma mimarisi üzerinden işlenir.
                    </p>
                  </div>

                  <div className="rounded-xl border border-subtle p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-emphasis text-sm">
                        E-posta İletim Sistemi (SMTP / E-posta Servisi)
                      </span>
                      <span className="rounded bg-muted/40 px-2 py-0.5 text-xs text-subtle">
                        E-posta Bildirimleri
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-subtle">
                      Hesap doğrulama, randevu onayı, takvim davetiyesi (.ics) ve hatırlatma iletilerinin
                      gönderilmesi için e-posta adresi ve ileti içeriği yalnızca gönderimin tamamlanması
                      amacıyla yapılandırılan SMTP / e-posta servisi üzerinden aktarılır.
                    </p>
                  </div>

                  <div className="rounded-xl border border-subtle p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-emphasis text-sm">Cloudflare, Inc.</span>
                      <span className="rounded bg-muted/40 px-2 py-0.5 text-xs text-subtle">
                        Ağ Güvenliği &amp; WAF
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-subtle">
                      Web trafiği güvenliği, DDoS/bot koruması ve alan adı yönlendirme hizmetleri kapsamında
                      teknik erişim verileri işlenebilir.
                    </p>
                  </div>

                  <div className="rounded-xl border border-subtle p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-emphasis text-sm">
                        Takvim ve Görüşme Entegrasyonları
                      </span>
                      <span className="rounded bg-muted/40 px-2 py-0.5 text-xs text-subtle">
                        Kullanıcı Tercihine Bağlı
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-subtle">
                      Hesap sahibi Google Takvim, Apple Calendar veya Outlook/Microsoft 365 takvimi ile Google
                      Meet, Zoom, Microsoft Teams ya da rOndevu Video görüşme servisi bağlarsa randevu zamanı
                      ve ilgili toplantı detayları yalnızca yetkilendirilen entegrasyonla eşitlenir.
                    </p>
                  </div>
                </div>
              </section>

              {/* 6. Saklama Süresi ve KVKK Hakları */}
              <section id="saklama-ve-haklar" className="scroll-mt-24 space-y-4 pt-6 border-t border-subtle">
                <h2 className="font-semibold text-lg text-emphasis sm:text-xl tracking-tight">
                  6. Saklama Süresi ve KVKK Madde 11 Kapsamındaki Haklarınız
                </h2>
                <p className="text-sm leading-relaxed text-subtle">
                  Kişisel verileriniz, hizmet ilişkisinin devamı boyunca ve ilgili mevzuatta öngörülen saklama
                  veya zamanaşımı süreleri kadar muhafaza edilir; işleme amacının ve yasal sürelerin sona
                  ermesinin ardından silinir, yok edilir veya anonim hale getirilir. KVKK&apos;nın 11. maddesi
                  uyarınca aşağıdaki haklara sahipsiniz:
                </p>
                <ul className="list-inside list-disc space-y-1.5 text-xs text-subtle">
                  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
                  <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme,</li>
                  <li>
                    Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp
                    kullanılmadığını öğrenme,
                  </li>
                  <li>
                    Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme,
                  </li>
                  <li>Eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</li>
                  <li>
                    KVKK m. 7 şartları çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini
                    isteme,
                  </li>
                  <li>
                    Düzeltme, silme veya yok etme işlemlerinin aktarılan üçüncü kişilere bildirilmesini
                    isteme,
                  </li>
                  <li>
                    Münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun
                    ortaya çıkmasına itiraz etme ve kanuna aykırı işleme nedeniyle zararın giderilmesini talep
                    etme.
                  </li>
                </ul>

                <div className="mt-6 rounded-xl border border-subtle bg-muted/15 p-4 sm:p-5">
                  <p className="text-xs leading-relaxed text-subtle">
                    <strong className="text-emphasis">Başvuru Kanalları:</strong> KVKK m. 11 kapsamındaki
                    taleplerinizi ve randevu verilerinize ilişkin başvurularınızı aşağıdaki kanallar üzerinden
                    bize iletebilirsiniz. Doğrudan hesap sahibinin randevu formunda talep ettiği özel bilgiler
                    için ilgili randevu sahibine de başvurabilirsiniz.
                  </p>
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
                      <span>WhatsApp İletişim</span>
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
