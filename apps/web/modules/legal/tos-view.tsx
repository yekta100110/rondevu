"use client";

import { APP_NAME } from "@rondevu/lib/constants";
import type { PlanContactConfig } from "@rondevu/lib/planContactConfig";
import { trpc } from "@rondevu/trpc/react";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Globe,
  Layers,
  Mail,
  MessageCircle,
  Phone,
  Scale,
} from "lucide-react";
import Link from "next/link";
import { MarketingFooter } from "../home/components/MarketingFooter";
import { MarketingHeader } from "../home/components/MarketingHeader";

const DEFAULT_SUPPORT_EMAIL = "destek@rondevu.org";
const DEFAULT_SUPPORT_PHONE = "0552 119 19 87";
const DEFAULT_SUPPORT_WHATSAPP = "905521191987";

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
  const whatsapp =
    rawWhatsapp && rawWhatsapp !== "908500000000" ? rawWhatsapp : DEFAULT_SUPPORT_WHATSAPP;
  const cleanWhatsapp = whatsapp.replace(/[^\d]/g, "");

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <MarketingHeader locale="tr" withAnchors={false} />

      {/* Main Container */}
      <main className="relative z-10 mx-auto max-w-3xl px-4 pt-32 pb-24 sm:px-6 lg:pt-40">
        {/* Header Hero */}
        <div className="mb-12 grid gap-3">
          <h1 className="text-balance font-semibold text-4xl tracking-[-0.045em] sm:text-5xl">
            Kullanım Koşulları
          </h1>
          <p className="text-lg text-muted-foreground">Hizmet kullanımı hakkında</p>
          <p className="font-mono text-muted-foreground text-xs">Son güncelleme: 14 Kasım 2026</p>
        </div>

        {/* Content Box */}
        <div className="space-y-8 rounded-xl border border-border bg-card p-6 sm:p-10">
          {/* Giriş */}
          <section className="space-y-3 border-subtle border-b pb-6">
            <p className="text-sm leading-relaxed text-subtle">
              Bu koşullar, <strong>{APP_NAME}</strong> (<code>https://rondevu.org</code>) üzerinden hesap
              açılması, randevu sayfası oluşturulması ve randevu alınmasıyla ilgili temel kullanım
              kurallarını açıklar. Hesap sahipleri, kendi randevu sayfalarındaki içerikten, hesap erişim
              güvenliğinden ve sundukları hizmetlerden sorumludur.
            </p>
          </section>

          {/* 1. Hizmetin Niteliği */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-emphasis" />
              <h2 className="font-semibold text-lg text-emphasis sm:text-xl">
                1. Hizmetin Kapsamı ve Hesap Aktivasyonu
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-subtle">
              {APP_NAME}, hesap sahiplerinin müsaitliklerini yönetmesine ve katılımcıların çevrimiçi randevu
              oluşturmasına yardımcı olan bir yazılım hizmetidir. Bildirim, SMS doğrulaması, görüşme
              bağlantısı ve takvim eşitleme gibi işlevler aktif plan kapsamına ve hesap ayarlarına göre
              sunulur. Güncel plan detayları{" "}
              <Link href="/pricing" className="text-emphasis underline-offset-2 hover:underline">
                Fiyatlandırma
              </Link>{" "}
              ve{" "}
              <Link href="/plan-bilgi" className="text-emphasis underline-offset-2 hover:underline">
                İletişim &amp; Aktivasyon
              </Link>{" "}
              sayfalarında yer alır.
            </p>
            <div className="rounded-xl border border-subtle bg-muted/20 p-4 text-xs leading-relaxed text-subtle">
              Randevuya konu olan hizmetin açıklaması, ücreti, iptal koşulları ve yerine getirilmesi
              randevu sahibi tarafından katılımcıya bildirilmelidir. Platformdaki randevu kaydı, bu
              hizmetin sunulduğunu veya sonucunu garanti etmez.
            </div>
          </section>

          {/* 2. Hizmetin Kullanımı */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-emphasis" />
              <h2 className="font-semibold text-lg text-emphasis sm:text-xl">
                2. Randevular ve Bağlı Hizmetler
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-subtle">
              Randevu akışını kullanırken aşağıdaki durumları dikkate alın:
            </p>
            <ul className="space-y-3 text-sm text-subtle">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" />
                <span>
                  <strong>Katılım ve iptal:</strong> Randevu sahibi ve katılımcı, randevuya katılma,
                  yeniden planlama ve iptal konusunda kendi aralarında iletişim kurmalıdır.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" />
                <span>
                  <strong>Bildirimler:</strong> SMS, WhatsApp (Evolution API) ve e-posta bildirim
                  iletileri harici sağlayıcılara ve ağ bağlantılarına bağlıdır. Bildirim gecikirse randevu
                  bilgilerini hesabınızdan veya onay bağlantınızdan kontrol edin.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" />
                <span>
                  <strong>Hizmet koşulları:</strong> Randevu sahibinin sunduğu hizmete ilişkin fiyat,
                  ödeme ve iade bilgileri ilgili hizmet sahibi tarafından açıklanır.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" />
                <span>
                  <strong>Entegrasyonlar:</strong> Takvim, WhatsApp (Evolution API) ve görüşme
                  sağlayıcılarında yaşanan kesintiler eşitlemeyi, bildirim iletimini veya toplantı
                  bağlantılarının oluşturulmasını etkileyebilir.
                </span>
              </li>
            </ul>
          </section>

          {/* 3. Kabul Edilebilir Kullanım ve Anti-Spam */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-emphasis" />
              <h2 className="font-semibold text-lg text-emphasis sm:text-xl">
                3. Kabul Edilebilir Kullanım ve Anti-Spam Politikası
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-subtle">
              Randevu sayfaları ve bildirim özellikleri meşru randevu organizasyonu için kullanılmalıdır.
            </p>
            <div className="space-y-3">
              <div className="rounded-xl border border-error/20 bg-destructive/5 p-4 text-xs leading-relaxed text-subtle dark:border-error/30">
                <div className="flex items-center gap-1.5 font-medium text-emphasis text-sm">
                  <AlertTriangle className="h-4 w-4 text-error" />
                  <span>Kesinlikle Yasaklanmış Faaliyetler:</span>
                </div>
                <ul className="mt-2 list-inside list-disc space-y-1">
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
                    yapmak veya hizmeti aşırı isteklerle kullanılamaz hale getirmek.
                  </li>
                </ul>
              </div>
              <p className="text-xs text-subtle">
                Kuralları ihlal eden veya bildirim sistemini kötüye kullanan hesapların erişimi, durum
                incelenirken sınırlandırılabilir. Sorularınız için aşağıdaki iletişim kanallarını kullanın.
              </p>
            </div>
          </section>

          {/* 4. Fikri Mülkiyet ve Değişiklikler */}
          <section className="space-y-4 border-subtle border-t pt-6">
            <h2 className="font-semibold text-lg text-emphasis sm:text-xl">
              4. Fikri Mülkiyet, Kullanım Sınırları ve İletişim
            </h2>
            <p className="text-sm leading-relaxed text-subtle">
              {APP_NAME} platformu, marka adı, logosu, alan adı, arayüz tasarımları ve özel yazılım
              bileşenleri üzerindeki tüm fikri ve sınai mülkiyet hakları {APP_NAME}&apos;ya aittir
              (alt bileşenlerde yer alan üçüncü taraf açık kaynak lisans hükümleri saklıdır). Kullanıcılar
              hizmeti yalnızca aktif hesap kapsamındaki bireysel veya kurumsal randevu yönetimi amacıyla
              kullanabilir; platform unsurları izinsiz kopyalanamaz, yeniden markalanamaz (white-label)
              veya üçüncü kişilere yeniden satılamaz. Bu koşullar güncellendiğinde güncel metin ve tarih
              bu sayfada yayımlanır.
            </p>
            <div className="mt-4 rounded-xl border border-subtle bg-muted/20 p-4">
              <p className="text-xs font-medium text-emphasis">Destek ve Hukuki İletişim Kanalları</p>
              <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-2 text-xs">
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-1.5 text-emphasis hover:underline">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{email}</span>
                </a>
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex items-center gap-1.5 text-emphasis hover:underline">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{phone}</span>
                </a>
                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-emphasis hover:underline">
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>WhatsApp</span>
                </a>
                <Link
                  href="/plan-bilgi"
                  className="flex items-center gap-1.5 text-emphasis hover:underline">
                  <Globe className="h-3.5 w-3.5" />
                  <span>https://rondevu.org/plan-bilgi</span>
                </Link>
              </div>
            </div>
          </section>
        </div>

      </main>
      <MarketingFooter locale="tr" initialContact={resolvedContact} />
    </div>
  );
}
