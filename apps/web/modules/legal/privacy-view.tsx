"use client";

import { APP_NAME } from "@rondevu/lib/constants";
import type { PlanContactConfig } from "@rondevu/lib/planContactConfig";
import { trpc } from "@rondevu/trpc/react";
import {
  CheckCircle2,
  Cookie,
  Database,
  Globe,
  Mail,
  MessageCircle,
  Phone,
  Scale,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { MarketingFooter } from "../home/components/MarketingFooter";
import { MarketingHeader } from "../home/components/MarketingHeader";

const DEFAULT_SUPPORT_EMAIL = "destek@rondevu.org";
const DEFAULT_SUPPORT_PHONE = "0552 119 19 87";
const DEFAULT_SUPPORT_WHATSAPP = "905521191987";

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
            Gizlilik Politikası ve KVKK Aydınlatma Metni
          </h1>
          <p className="text-lg text-muted-foreground">6698 Sayılı KVKK Kapsamında Aydınlatma Metni</p>
          <p className="font-mono text-muted-foreground text-xs">Son güncelleme: 14 Kasım 2026</p>
        </div>

        {/* Content Box */}
        <div className="space-y-8 rounded-xl border border-border bg-card p-6 sm:p-10">
          {/* Section: Giriş ve Veri Sorumlusu */}
          <section className="space-y-4 border-subtle border-b pb-6">
            <p className="text-sm leading-relaxed text-subtle">
              Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) uyarınca{" "}
              <strong>{APP_NAME}</strong> (<code>https://rondevu.org</code>) üzerinden sunulan çevrimiçi
              randevu ve takvim yönetimi hizmetleri kapsamında kişisel verilerin işlenme amaçlarını, hukuki
              sebeplerini, aktarım koşullarını ve ilgili kişi haklarını açıklamak amacıyla hazırlanmıştır.
            </p>
            <div className="rounded-xl border border-subtle bg-muted/20 p-4 text-xs leading-relaxed text-subtle">
              <p className="font-medium text-emphasis">Veri Sorumlusu İletişim Kanalları</p>
              <p className="mt-1">
                Platform: {APP_NAME} (<code>https://rondevu.org</code>)
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2">
                <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 text-emphasis hover:underline">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{email}</span>
                </a>
                <a href={`tel:${cleanPhone}`} className="inline-flex items-center gap-1.5 text-emphasis hover:underline">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{phone}</span>
                </a>
                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emphasis hover:underline">
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>WhatsApp</span>
                </a>
                <Link href="/plan-bilgi" className="inline-flex items-center gap-1.5 text-emphasis hover:underline">
                  <Globe className="h-3.5 w-3.5" />
                  <span>https://rondevu.org/plan-bilgi</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Section 1: Rol Ayrımı */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-emphasis" />
              <h2 className="font-semibold text-lg text-emphasis sm:text-xl">
                1. Hesap Sahibi ve Katılımcı Rolleri
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-subtle">
              İşlenen kişisel veriler, hesap sahibinin etkinleştirdiği özelliklere ve randevu formunda talep
              ettiği alanlara göre değişiklik gösterebilir.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-subtle bg-muted/20 p-4">
                <h3 className="font-medium text-emphasis text-sm">Hesap sahipleri (Uzmanlar & İşletmeler)</h3>
                <p className="mt-2 text-xs leading-relaxed text-subtle">
                  Hesap oluşturma, abonelik aktivasyonu ve takvim yönetimi sırasında ad, soyad, e-posta
                  adresi, telefon numarası, oturum bilgileri, müsaitlik tercihleri ve bağlı takvim ayarları
                  işlenir.
                </p>
              </div>
              <div className="rounded-xl border border-subtle bg-muted/20 p-4">
                <h3 className="font-medium text-emphasis text-sm">Randevu alan kişiler (Danışanlar)</h3>
                <p className="mt-2 text-xs leading-relaxed text-subtle">
                  Randevu oluşturma sırasında paylaşılan ad, e-posta, telefon numarası, seçilen zaman dilimi
                  ve form yanıtları randevunun kurulması ve bildirimlerin iletilmesi için işlenir. Hesap
                  sahibi, kendi randevu sayfasında istediği ek alanlara ilişkin kendi aydınlatma
                  yükümlülüğünden sorumludur.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: İşlenen Kişisel Veri Kategorileri */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-emphasis" />
              <h2 className="font-semibold text-lg text-emphasis sm:text-xl">
                2. İşlenen Kişisel Veri Kategorileri ve Amaçları
              </h2>
            </div>
            <ul className="space-y-3 text-sm text-subtle">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" />
                <span>
                  <strong>Kimlik ve İletişim Bilgileri (Ad, soyad, e-posta, telefon numarası):</strong>{" "}
                  Hesap açılışı ve doğrulaması, katılımcının randevu sahibine bildirilmesi, SMS OTP
                  doğrulaması (etkinleştirildiğinde) ile e-posta, SMS ve WhatsApp üzerinden randevu
                  onayı ve hatırlatma iletilerinin gönderilmesi amacıyla işlenir.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" />
                <span>
                  <strong>Randevu ve İşlem Bilgileri (Randevu zamanı, müsaitlik, form yanıtları):</strong>{" "}
                  Uygun zaman aralıklarının hesaplanması, randevu oluşturma, yeniden planlama veya iptal
                  süreçlerinin yürütülmesi ve bağlı takvimlerle eşitleme yapılması için işlenir.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" />
                <span>
                  <strong>İşlem Güvenliği ve Teknik Kayıtlar (IP adresi, tarayıcı/cihaz bilgisi, erişim kayıtları):</strong>{" "}
                  Hizmetin kesintisiz işletilmesi, oturum güvenliğinin sağlanması, hata incelemesi ve
                  kötüye kullanım ile yetkisiz erişim girişimlerinin önlenmesi amacıyla işlenir.
                </span>
              </li>
            </ul>
          </section>

          {/* Section 3: Hukuki Sebepler (KVKK m.5) */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-emphasis" />
              <h2 className="font-semibold text-lg text-emphasis sm:text-xl">
                3. Kişisel Verilerin İşlenme Hukuki Sebepleri (KVKK m. 5)
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-subtle">
              Kişisel verileriniz, KVKK&apos;nın 5. maddesinin 2. fıkrasında düzenlenen aşağıdaki hukuki
              sebeplere dayanılarak otomatik veya kısmen otomatik yollarla işlenir:
            </p>
            <ul className="space-y-2.5 text-sm text-subtle">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" />
                <span>
                  <strong>Sözleşmenin kurulması ve ifası (KVKK m. 5/2-c):</strong> Hesap aktivasyonu,
                  randevu sayfasının işletilmesi, randevu kaydının oluşturulması ile e-posta, SMS ve
                  WhatsApp bildirimlerinin iletilmesi.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" />
                <span>
                  <strong>Hukuki yükümlülüğün yerine getirilmesi (KVKK m. 5/2-ç):</strong> Yasal
                  düzenlemelerden kaynaklanan kayıt tutma ve yetkili kurum taleplerinin karşılanması.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" />
                <span>
                  <strong>Bir hakkın tesisi, kullanılması veya korunması (KVKK m. 5/2-e):</strong>{" "}
                  Randevu ve işlem kayıtlarına ilişkin olası uyuşmazlıklarda doğrulama sağlanması.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" />
                <span>
                  <strong>Meşru menfaat (KVKK m. 5/2-f):</strong> Temel hak ve özgürlüklerinize zarar
                  vermemek kaydıyla sistem güvenliği, anti-spam/OTP suistimal koruması ve hata giderme
                  çalışmaları.
                </span>
              </li>
            </ul>
            <p className="text-xs leading-relaxed text-subtle">
              Yasal olarak açık rıza gerektiren isteğe bağlı entegrasyonlar veya özel tercihler söz konusu
              olduğunda verileriniz KVKK m. 5/1 kapsamında açık rızanıza dayalı olarak işlenir.
            </p>
          </section>

          {/* Section 4: Çerezler ve Oturum Kullanımı */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-emphasis" />
              <h2 className="font-semibold text-lg text-emphasis sm:text-xl">
                4. Çerezler (Cookies) ve Oturum Kullanımı
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-subtle">
              {APP_NAME}, hizmetin temel işlevlerini yürütebilmek için yalnızca gerekli oturum ve tercih
              çerezlerinden yararlanır. Üçüncü taraf reklam ağı veya davranışsal hedefleme çerezleri
              kullanılmaz.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-subtle bg-muted/20 p-4">
                <h3 className="font-medium text-emphasis text-sm">Zorunlu Oturum ve Güvenlik Çerezleri</h3>
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

          {/* Section 5: Bağlı Hizmetler */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emphasis" />
              <h2 className="font-semibold text-lg text-emphasis sm:text-xl">
                5. Bağlı Hizmetler ve Veri Aktarımı
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-subtle">
              Kişisel verileriniz üçüncü kişilere satılmaz. Yalnızca kullanılan özelliklerin çalışabilmesi
              için ilgili teknik altyapı ve iletişim sağlayıcılarıyla gereken asgari düzeyde paylaşım
              yapılabilir:
            </p>
            <div className="space-y-3">
              <div className="rounded-xl border border-subtle p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emphasis text-sm">SMS / OTP Sağlayıcısı</span>
                  <span className="rounded bg-muted/40 px-2 py-0.5 text-xs text-subtle">
                    SMS & OTP Servisi
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
                    WhatsApp Bildirim Altyapısı (Evolution API)
                  </span>
                  <span className="rounded bg-muted/40 px-2 py-0.5 text-xs text-subtle">
                    WhatsApp Bildirimleri
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-subtle">
                  WhatsApp üzerinden randevu onayı veya hatırlatma gönderimi etkinleştirildiğinde
                  telefon numarası ve randevu bildirim içeriği yalnızca mesajın iletilmesi amacıyla
                  Evolution API altyapısı üzerinden işlenir.
                </p>
              </div>

              <div className="rounded-xl border border-subtle p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emphasis text-sm">
                    E-posta İletim Altyapısı (SMTP / E-posta Servisi)
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
                    Ağ Güvenliği & WAF
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-subtle">
                  Web trafiği güvenliği, DDoS/bot koruması ve alan adı yönlendirme hizmetleri kapsamında
                  teknik erişim verileri işlenebilir.
                </p>
              </div>

              <div className="rounded-xl border border-subtle p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emphasis text-sm">Takvim ve Görüşme Entegrasyonları</span>
                  <span className="rounded bg-muted/40 px-2 py-0.5 text-xs text-subtle">
                    Kullanıcı Tercihine Bağlı
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-subtle">
                  Hesap sahibi Google Takvim, Apple Calendar veya Outlook/Microsoft 365 takvimi ile
                  Google Meet, Zoom, Microsoft Teams ya da rOndevu Video görüşme servisi bağlarsa randevu
                  zamanı ve ilgili toplantı detayları yalnızca yetkilendirilen entegrasyonla eşitlenir.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Veri Saklama ve KVKK m.11 Hakları */}
          <section className="space-y-4">
            <h2 className="font-semibold text-lg text-emphasis sm:text-xl">
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
              <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
              <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme,</li>
              <li>Eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</li>
              <li>KVKK m. 7 şartları çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme,</li>
              <li>Düzeltme, silme veya yok etme işlemlerinin aktarılan üçüncü kişilere bildirilmesini isteme,</li>
              <li>Münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme ve kanuna aykırı işleme nedeniyle zararın giderilmesini talep etme.</li>
            </ul>
            <div className="mt-4 rounded-xl border border-subtle bg-muted/20 p-4">
              <p className="text-xs leading-relaxed text-subtle">
                <strong>Başvuru Kanalları:</strong> KVKK m. 11 kapsamındaki taleplerinizi ve randevu
                verilerinize ilişkin başvurularınızı aşağıdaki kanallar üzerinden bize iletebilirsiniz.
                Doğrudan hesap sahibinin randevu formunda talep ettiği özel bilgiler için ilgili randevu
                sahibine de başvurabilirsiniz.
              </p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs">
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
