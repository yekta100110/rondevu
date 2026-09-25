"use client";

import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { TextField } from "@calcom/ui/components/form";
import { showToast } from "@calcom/ui/components/toast";
import { Mail, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

const DEFAULT_CONFIG = {
  phone: "0552 119 19 87",
  email: "destek@rondevu.org",
  whatsapp: "905521191987",
};

export default function PlanContactAdminView() {
  const utils = trpc.useContext();
  const [phone, setPhone] = useState(DEFAULT_CONFIG.phone);
  const [email, setEmail] = useState(DEFAULT_CONFIG.email);
  const [whatsapp, setWhatsapp] = useState(DEFAULT_CONFIG.whatsapp);

  const { data: config, isLoading } = trpc.viewer.admin.getPlanContact.useQuery();

  useEffect(() => {
    if (config) {
      setPhone(config.phone);
      setEmail(config.email);
      setWhatsapp(config.whatsapp);
    }
  }, [config]);

  const updateMutation = trpc.viewer.admin.updatePlanContact.useMutation({
    onSuccess: async (data) => {
      showToast("Plan iletişim bilgileri başarıyla güncellendi.", "success");
      setPhone(data.phone);
      setEmail(data.email);
      setWhatsapp(data.whatsapp);
      // Invalidate both admin and public queries across the entire app
      await Promise.all([
        utils.viewer.admin.getPlanContact.invalidate(),
        utils.viewer.public.getPlanContact.invalidate(),
      ]);
    },
    onError: (err) => {
      showToast(`Hata: ${err.message}`, "error");
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      phone: phone.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
    });
  };

  const handleResetToDefault = () => {
    if (
      window.confirm(
        "İletişim bilgilerini varsayılan rOndevu değerlerine sıfırlamak istediğinize emin misiniz?"
      )
    ) {
      setPhone(DEFAULT_CONFIG.phone);
      setEmail(DEFAULT_CONFIG.email);
      setWhatsapp(DEFAULT_CONFIG.whatsapp);
      updateMutation.mutate(DEFAULT_CONFIG);
    }
  };

  const cleanPhone = phone.replace(/[^\d+]/g, "");
  const cleanWhatsapp = whatsapp.replace(/[^\d]/g, "");

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-subtle bg-default p-6 space-y-6 shadow-xs">
        <div>
          <h3 className="font-semibold text-emphasis text-base">Plan Başvuru & İletişim Kanalları</h3>
          <p className="mt-1 text-xs text-subtle leading-relaxed">
            Ana sayfa (/), danışma barı, özellik kartları ve /plan-bilgi sayfasında danışanlarınıza ve
            ziyaretçilerinize sunulan doğrudan arama, WhatsApp ve e-posta bilgilerini buradan
            yönetebilirsiniz. Kaydettiğiniz değişiklikler tüm sitede anında güncellenir.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4 max-w-xl">
          <div>
            <label htmlFor="plan-phone" className="block text-xs font-medium text-emphasis mb-1">
              Telefon Numarası
            </label>
            <TextField
              id="plan-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0552 119 19 87"
              disabled={isLoading}
              required
            />
            <p className="mt-1 text-[11px] text-subtle">
              Örnek: 0552 119 19 87 (tel: bağlantısı için otomatik formatlanır)
            </p>
          </div>

          <div>
            <label htmlFor="plan-whatsapp" className="block text-xs font-medium text-emphasis mb-1">
              WhatsApp Numarası
            </label>
            <TextField
              id="plan-whatsapp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="905521191987"
              disabled={isLoading}
              required
            />
            <p className="mt-1 text-[11px] text-subtle">
              Ülke koduyla birlikte rakamlar (Örnek: 905521191987)
            </p>
          </div>

          <div>
            <label htmlFor="plan-email" className="block text-xs font-medium text-emphasis mb-1">
              E-posta Adresi
            </label>
            <TextField
              id="plan-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="destek@rondevu.org"
              disabled={isLoading}
              required
            />
            <p className="mt-1 text-[11px] text-subtle">
              Müşteri soruları ve aktivasyon taleplerinin yönlendirileceği e-posta adresi.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              loading={updateMutation.isPending}
              disabled={isLoading || updateMutation.isPending}>
              Değişiklikleri Kaydet
            </Button>
            <Button
              type="button"
              color="secondary"
              onClick={handleResetToDefault}
              disabled={isLoading || updateMutation.isPending}>
              Varsayılana Sıfırla
            </Button>
          </div>
        </form>
      </div>

      {/* Güvenlik & Denetim Özeti */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-start gap-3 text-xs text-subtle">
        <ShieldCheck className="size-5 text-emerald-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-emphasis">Güvenlik Denetimi & İzolasyon</div>
          <p className="leading-relaxed">
            Bu ayarlar yalnızca <span className="font-mono text-emphasis">ADMIN</span> yetkisine sahip
            hesaplar tarafından değiştirilebilir. Girilen değerler Zod şemasıyla doğrulanır; XSS, zararlı
            script veya geçersiz URL protokollerine (javascript:, data:) izin verilmez. Linkler tel:, mailto:
            ve wa.me protokollerine göre güvenli sanitize edilerek render edilir.
          </p>
        </div>
      </div>

      {/* Canlı Önizleme Kartı */}
      <div className="rounded-xl border border-subtle bg-default p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-subtle pb-3">
          <h4 className="font-semibold text-emphasis text-sm">Canlı Önizleme (Ana Sayfa & /plan-bilgi)</h4>
          <span className="text-[11px] text-subtle">Kullanıcıların göreceği canlı kartlar</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-xl">
          <div className="rounded-xl border border-subtle bg-muted/20 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emphasis">
              <Phone className="size-4 text-emerald-500" />
              <span>Telefon & WhatsApp</span>
            </div>
            <div className="font-mono text-sm font-medium text-emphasis">{phone || "—"}</div>
            <div className="flex gap-2 pt-1">
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-1 rounded bg-emphasis px-2 py-1 text-[11px] font-medium text-default">
                Ara ({cleanPhone})
              </a>
              <a
                href={`https://wa.me/${cleanWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded border border-subtle bg-default px-2 py-1 text-[11px] font-medium text-emphasis">
                <MessageCircle className="size-3" />
                WhatsApp
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-subtle bg-muted/20 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emphasis">
              <Mail className="size-4 text-sky-500" />
              <span>E-posta</span>
            </div>
            <div className="font-mono text-sm font-medium text-emphasis break-all">{email || "—"}</div>
            <div className="pt-1">
              <a
                href={`mailto:${encodeURIComponent(email)}`}
                className="inline-flex items-center gap-1 rounded border border-subtle bg-default px-2 py-1 text-[11px] font-medium text-emphasis">
                <Mail className="size-3" />
                E-posta Gönder
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
