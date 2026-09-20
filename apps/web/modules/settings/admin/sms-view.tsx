"use client";

import { trpc } from "@calcom/trpc/react";
import { Badge } from "@calcom/ui/components/badge";
import { Button } from "@calcom/ui/components/button";
import { TextField } from "@calcom/ui/components/form";
import { Icon } from "@calcom/ui/components/icon";
import { showToast } from "@calcom/ui/components/toast";
import { useState } from "react";
import UsersTable from "./components/UsersTable";

export default function SMSAdminView() {
  const [testPhone, setTestPhone] = useState("+905521191987");
  const [testMessage, setTestMessage] = useState(
    "rOndevu SMS Test Bildirimi: SMS altyapınız başarıyla çalışmaktadır."
  );
  const [testResult, setTestResult] = useState<{
    success: boolean;
    provider?: string;
    messageId?: string;
    error?: string;
  } | null>(null);

  const [username, setUsername] = useState("");
  const [teamSlug, setTeamSlug] = useState("");

  const utils = trpc.useContext();

  const {
    data: smsConfig,
    isLoading: isConfigLoading,
    refetch: refetchConfig,
  } = trpc.viewer.admin.getSMSConfig.useQuery();

  const sendTestMutation = trpc.viewer.admin.sendTestSMS.useMutation({
    onSuccess: (data) => {
      setTestResult(data);
      if (data.success) {
        showToast(
          `Test SMS başarıyla gönderildi (${data.provider.toUpperCase()} - ID: ${data.messageId})`,
          "success"
        );
      } else {
        showToast(`SMS gönderilemedi: ${data.error}`, "error");
      }
    },
    onError: (error) => {
      setTestResult({ success: false, error: error.message });
      showToast(`Hata: ${error.message}`, "error");
    },
  });

  const lockMutation = trpc.viewer.admin.setSMSLockState.useMutation({
    onSuccess: (data) => {
      if (data) {
        showToast(
          `${data.name} kullanıcısının SMS durumu: ${data.locked ? "Kilitlendi" : "Kilit Açıldı"}`,
          "success"
        );
      }
      utils.viewer.admin.getSMSLockStateTeamsUsers.invalidate();
    },
    onError: (error) => {
      showToast(`${error}`, "error");
      utils.viewer.admin.getSMSLockStateTeamsUsers.invalidate();
    },
  });

  function setSMSLockState({ userId, teamId, lock }: { userId?: number; teamId?: number; lock: boolean }) {
    lockMutation.mutate({ userId, teamId, lock });
  }

  const templates = [
    {
      name: "Randevu Onayı (Scheduled)",
      file: "event-scheduled-sms.ts",
      trigger: "Randevu başarıyla alındığında katılımcıya SMS gider.",
    },
    {
      name: "Yeniden Planlama (Rescheduled)",
      file: "event-rescheduled-sms.ts",
      trigger: "Randevu saati/günü değiştiğinde güncel saat iletilir.",
    },
    {
      name: "Randevu İptali (Cancelled)",
      file: "event-cancelled-sms.ts",
      trigger: "Randevu iptal edildiğinde iptal sebebiyle birlikte iletilir.",
    },
    {
      name: "Randevu Reddi (Declined)",
      file: "event-declined-sms.ts",
      trigger: "Ev sahibi randevu talebini geri çevirdiğinde gönderilir.",
    },
    {
      name: "Onay Bekleyen Talep (Request)",
      file: "event-request-sms.ts",
      trigger: "Manuel onay gerektiren randevu oluşturulduğunda gider.",
    },
    {
      name: "Yeniden Planlama Talebi (Request to Reschedule)",
      file: "event-request-to-reschedule-sms.ts",
      trigger: "Kullanıcıdan randevuyu ertelemesi rica edildiğinde gider.",
    },
    {
      name: "Konum Değişikliği (Location Changed)",
      file: "event-location-changed-sms.ts",
      trigger: "Fiziksel adres veya online link güncellendiğinde gider.",
    },
    {
      name: "Koltuk İptali (Cancelled Seat)",
      file: "cancelled-seat-sms.ts",
      trigger: "Koltuklu/grup etkinliklerinde tekil katılımcı iptalinde gider.",
    },
    {
      name: "Ödeme Bekleniyor (Awaiting Payment)",
      file: "awaiting-payment-sms.ts",
      trigger: "Ücretli randevularda ödeme linki katılımcıya SMS iletilir.",
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. SAĞLAYICI DURUM KARTI */}
      <div className="rounded-xl border border-subtle bg-default p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-emphasis">SMS Altyapı ve Sağlayıcı Durumu</h3>
              {isConfigLoading ? (
                <Badge variant="gray">Kontrol ediliyor...</Badge>
              ) : smsConfig?.mode === "production" ? (
                <Badge variant="green">Üretim Modu (Canlı)</Badge>
              ) : (
                <Badge variant="orange">Simülasyon Modu (Test)</Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-subtle">
              Randevu onayları, hatırlatmalar ve iptal bildirimleri için kullanılan SMS taşıyıcı motoru.
            </p>
          </div>
          <Button color="secondary" size="sm" StartIcon="refresh-cw" onClick={() => refetchConfig()}>
            Yenile
          </Button>
        </div>

        {/* Sağlayıcı Detay Izgarası */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Netgsm */}
          <div
            className={`rounded-lg border p-4 transition-all ${
              smsConfig?.activeProvider === "netgsm"
                ? "border-primary bg-subtle/50 ring-1 ring-primary"
                : "border-subtle bg-default opacity-80"
            }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-emphasis">Netgsm (Türkiye)</span>
              {smsConfig?.providerDetails.netgsm.configured ? (
                <Badge variant="green">Bağlı</Badge>
              ) : (
                <Badge variant="gray">Yapılandırılmadı</Badge>
              )}
            </div>
            <p className="mt-2 text-xs text-subtle">
              Türkiye içi resmi başlıklı SMS gönderimleri için idealdir.
            </p>
            <div className="mt-3 space-y-1 text-xs text-subtle">
              <div>
                Başlık (Originator):{" "}
                <span className="font-mono text-emphasis">
                  {smsConfig?.providerDetails.netgsm.header || "Tanımlanmadı"}
                </span>
              </div>
              <div>
                Kullanıcı Kodu:{" "}
                <span className="font-mono text-emphasis">
                  {smsConfig?.providerDetails.netgsm.usercode || "Tanımlanmadı"}
                </span>
              </div>
            </div>
          </div>

          {/* Twilio */}
          <div
            className={`rounded-lg border p-4 transition-all ${
              smsConfig?.activeProvider === "twilio"
                ? "border-primary bg-subtle/50 ring-1 ring-primary"
                : "border-subtle bg-default opacity-80"
            }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-emphasis">Twilio (Global)</span>
              {smsConfig?.providerDetails.twilio.configured ? (
                <Badge variant="green">Bağlı</Badge>
              ) : (
                <Badge variant="gray">Yapılandırılmadı</Badge>
              )}
            </div>
            <p className="mt-2 text-xs text-subtle">
              Uluslararası SMS gönderimleri ve Twilio Messaging Service desteği.
            </p>
            <div className="mt-3 space-y-1 text-xs text-subtle">
              <div>
                Telefon No:{" "}
                <span className="font-mono text-emphasis">
                  {smsConfig?.providerDetails.twilio.phoneNumber || "Tanımlanmadı"}
                </span>
              </div>
              <div>
                Messaging SID:{" "}
                <span className="font-mono text-emphasis">
                  {smsConfig?.providerDetails.twilio.messagingSid || "Yok"}
                </span>
              </div>
            </div>
          </div>

          {/* Webhook / Simülasyon */}
          <div
            className={`rounded-lg border p-4 transition-all ${
              smsConfig?.activeProvider === "simulation" || smsConfig?.activeProvider === "webhook"
                ? "border-primary bg-subtle/50 ring-1 ring-primary"
                : "border-subtle bg-default opacity-80"
            }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-emphasis">
                {smsConfig?.activeProvider === "webhook" ? "Özel Webhook" : "Simülasyon Modu"}
              </span>
              <Badge variant="blue">Geliştirici</Badge>
            </div>
            <p className="mt-2 text-xs text-subtle">
              {smsConfig?.activeProvider === "webhook"
                ? "Harici HTTP Gateway adresine POST istekleri gönderilir."
                : "Gerçek SMS gönderilmez, terminale ve loglara simüle edilir."}
            </p>
            <div className="mt-3 text-xs text-subtle">
              Durum:{" "}
              <span className="font-medium text-emphasis">
                {smsConfig?.activeProvider === "simulation"
                  ? "Terminal Çıktısı Aktif"
                  : "REST Endpoint Aktif"}
              </span>
            </div>
          </div>
        </div>

        {/* Kurulum Yardım Kutusu */}
        {!smsConfig?.isConfigured && (
          <div className="mt-6 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-600 dark:text-amber-400">
            <div className="flex items-center gap-2 font-semibold">
              <Icon name="info" className="h-4 w-4" />
              SMS Gönderimini Aktifleştirmek İçin:
            </div>
            <p className="mt-1">
              Ortam değişkenlerinize (.env) Netgsm için{" "}
              <code className="rounded bg-muted px-1 py-0.5">NETGSM_USERCODE</code>,{" "}
              <code className="rounded bg-muted px-1 py-0.5">NETGSM_PASSWORD</code>,{" "}
              <code className="rounded bg-muted px-1 py-0.5">NETGSM_HEADER</code> veya Twilio için{" "}
              <code className="rounded bg-muted px-1 py-0.5">TWILIO_SID</code>,{" "}
              <code className="rounded bg-muted px-1 py-0.5">TWILIO_TOKEN</code>,{" "}
              <code className="rounded bg-muted px-1 py-0.5">TWILIO_PHONE_NUMBER</code> tanımlamanız
              yeterlidir.
            </p>
          </div>
        )}
      </div>

      {/* 2. ANLIK TEST SMS GÖNDERİM FORMU */}
      <div className="rounded-xl border border-subtle bg-default p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-emphasis">Anlık Test SMS Gönderimi</h3>
        <p className="mt-1 text-sm text-subtle">
          Belirlediğiniz telefon numarasına hemen test mesajı göndererek bağlantıyı ve SMS başlığınızı
          doğrulayın.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-subtle">Hedef Telefon Numarası</label>
            <TextField
              name="testPhone"
              placeholder="+905521191987 veya 05521191987"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-subtle">Test Mesajı</label>
            <TextField
              name="testMessage"
              placeholder="Test bildirim metni"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Button
            color="primary"
            loading={sendTestMutation.isPending}
            onClick={() => sendTestMutation.mutate({ phoneNumber: testPhone, message: testMessage })}>
            Test SMS Gönder
          </Button>

          {testResult && (
            <div
              className={`rounded-lg px-3 py-2 text-xs font-medium ${
                testResult.success
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : "bg-red-500/10 text-red-600 dark:text-red-400"
              }`}>
              {testResult.success
                ? `Başarılı! Taşıyıcı: ${testResult.provider} (ID: ${testResult.messageId})`
                : `Başarısız: ${testResult.error}`}
            </div>
          )}
        </div>
      </div>

      {/* 3. AKTİF SMS ŞABLONLARI LİSTESİ */}
      <div className="rounded-xl border border-subtle bg-default p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-emphasis">Aktif SMS Şablonları ve İş Akışları</h3>
        <p className="mt-1 text-sm text-subtle">
          Sistemde tanımlı 9 farklı SMS senaryosu. Katılımcının telefon numarası bulunduğunda e-posta ile
          eşzamanlı tetiklenir.
        </p>

        <div className="mt-4 divide-y divide-subtle overflow-hidden rounded-lg border border-subtle text-sm">
          {templates.map((tpl, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between gap-2 p-3 hover:bg-muted/40 sm:flex-row sm:items-center">
              <div>
                <div className="font-medium text-emphasis">{tpl.name}</div>
                <div className="text-xs text-subtle">{tpl.trigger}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-subtle">{tpl.file}</span>
                <Badge variant="green">Otomatik Devrede</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. RATE LIMIT & KİLİTLİ HESAP YÖNETİMİ */}
      <div className="rounded-xl border border-subtle bg-default p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-emphasis">Hız Sınırı (Rate Limit) ve Kilitli Hesaplar</h3>
          <p className="mt-1 text-sm text-subtle">
            Aşırı SMS gönderimi nedeniyle spam koruması tarafından kilitlenen kullanıcı ve takımları yönetin.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <TextField
              name="Lock User"
              placeholder="kullanıcı adı"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button
              color="secondary"
              onClick={() => {
                if (username) {
                  lockMutation.mutate({ username, lock: true });
                }
              }}>
              Kullanıcıyı Kilitle
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <TextField
              name="Lock Team"
              placeholder="takım slug'ı"
              value={teamSlug}
              onChange={(e) => setTeamSlug(e.target.value)}
            />
            <Button
              color="secondary"
              onClick={() => {
                if (teamSlug) {
                  lockMutation.mutate({ teamSlug, lock: true });
                }
              }}>
              Takımı Kilitle
            </Button>
          </div>
        </div>

        <UsersTable setSMSLockState={setSMSLockState} />
      </div>
    </div>
  );
}
