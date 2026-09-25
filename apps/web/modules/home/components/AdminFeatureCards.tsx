"use client";

import { trpc } from "@calcom/trpc/react";
import classNames from "@calcom/ui/classNames";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CalendarOff,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  Eye,
  Filter,
  Globe,
  Headphones,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Repeat,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Trash2,
  UserX,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";

export function AdminFeatureCards() {
  const [activeOoo, setActiveOoo] = useState(false);
  const [isNoShowMarked, setIsNoShowMarked] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("yaklasan");
  const [block2Mode, setBlock2Mode] = useState<"bookings" | "ooo">("bookings");
  const [isOooModalOpen, setIsOooModalOpen] = useState(false);
  const [oooTab, setOooTab] = useState<"mine" | "holidays">("mine");
  const [showPublicPreview, setShowPublicPreview] = useState(true);

  const { data: contactConfig } = trpc.publicViewer.getPlanContact.useQuery(undefined, {
    staleTime: 60000,
  });

  const phone = contactConfig?.phone || "0552 119 19 87";
  const email = contactConfig?.email || "destek@rondevu.org";
  const whatsapp = contactConfig?.whatsapp || "905521191987";

  return (
    <div className="space-y-24 py-12">
      {/* ========================================================= */}
      {/* 1. BLOK: TAKVİM & ZAMAN HAKİMİYETİ */}
      {/* ========================================================= */}
      <section aria-labelledby="time-management-heading" className="scroll-mt-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Sol: Açıklamalar */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-muted/40 px-3 py-1 text-xs font-medium text-subtle">
              <Calendar className="size-3.5 text-emphasis" />
              <span>Sizin Takviminiz, Sizin Kurallarınız</span>
            </div>

            <h2
              id="time-management-heading"
              className="font-bold font-cal text-2xl text-emphasis sm:text-3xl leading-snug">
              Müsaitlik, mesai saatleri ve tatiller tam kontrolünüzde
            </h2>

            <p className="text-sm text-subtle leading-relaxed sm:text-base">
              Haftalık çalışma saatlerinizi tek tıkla güncelleyin, bayram ve tatil günlerini önceden kapatın.
              Alınan tüm randevular anlık olarak Google Takvim ve Apple Calendar hesabınıza aktarılır;
              programınızı telefonunuzun veya bilgisayarınızın yerel takviminden zahmetsizce takip edersiniz.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
              <div className="rounded-xl border border-subtle bg-default/60 p-4">
                <div className="flex items-center gap-2 font-semibold text-emphasis text-sm">
                  <Sliders className="size-4 text-emphasis" />
                  <span>Esnek Mesai Yönetimi</span>
                </div>
                <p className="mt-1.5 text-xs text-subtle leading-relaxed">
                  Her güne özel saat aralığı, ara dinlenme süreleri ve tek tıkla günleri birbirine kopyalama.
                </p>
              </div>

              <div className="rounded-xl border border-subtle bg-default/60 p-4">
                <div className="flex items-center gap-2 font-semibold text-emphasis text-sm">
                  <CalendarOff className="size-4 text-emphasis" />
                  <span>Özel Gün & Bayram Tatili</span>
                </div>
                <p className="mt-1.5 text-xs text-subtle leading-relaxed">
                  Resmi bayramları, doğum günlerinizi veya tatillerinizi önceden takvime girerek o günleri
                  randevuya kapatın.
                </p>
              </div>

              <div className="rounded-xl border border-subtle bg-default/60 p-4">
                <div className="flex items-center gap-2 font-semibold text-emphasis text-sm">
                  <RefreshCw className="size-4 text-emphasis" />
                  <span>Google & Apple Sync</span>
                </div>
                <p className="mt-1.5 text-xs text-subtle leading-relaxed">
                  Alınan tüm randevular anlık olarak Google ve Apple takviminize aktarılır; görüşmelerinizi
                  doğrudan kendi takviminizden takip edersiniz.
                </p>
              </div>

              <div className="rounded-xl border border-subtle bg-default/60 p-4">
                <div className="flex items-center gap-2 font-semibold text-emphasis text-sm">
                  <Clock className="size-4 text-emphasis" />
                  <span>İptal & Erteleme Kuralları</span>
                </div>
                <p className="mt-1.5 text-xs text-subtle leading-relaxed">
                  "Randevuya 12 saat kala iptal edilemez, 4 saat kala ertelenemez" gibi katı kurallar
                  koyabilme.
                </p>
              </div>
            </div>
          </div>

          {/* Sağ: Mockup (Screenshot 2 & 9 ilhamlı) */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-subtle bg-default p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-subtle border-b pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-emphasis">Çalışma Saatleri & Müsaitlik</span>
                  <span className="rounded border border-subtle bg-muted/40 px-2 py-0.5 font-medium text-[11px] text-emphasis">
                    Varsayılan Plan
                  </span>
                </div>
                <span className="text-[11px] text-subtle">Europe/Istanbul</span>
              </div>

              {/* Günler Listesi Mockup */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-lg border border-subtle bg-muted/20 px-3 py-2">
                  <div className="flex items-center gap-3">
                    <span className="size-1.5 rounded-full bg-emphasis" />
                    <span className="font-medium text-emphasis w-20">Pazartesi</span>
                    <span className="rounded bg-default px-2 py-1 text-emphasis border border-subtle">
                      09:00 - 17:00
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-subtle">
                    <span className="text-[11px] text-subtle font-medium">Aktif</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-subtle bg-muted/20 px-3 py-2">
                  <div className="flex items-center gap-3">
                    <span className="size-1.5 rounded-full bg-emphasis" />
                    <span className="font-medium text-emphasis w-20">Salı</span>
                    <span className="rounded bg-default px-2 py-1 text-emphasis border border-subtle">
                      09:00 - 17:00
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-subtle">
                    <span className="text-[11px] text-subtle font-medium">Aktif</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-subtle bg-muted/20 px-3 py-2">
                  <div className="flex items-center gap-3">
                    <span className="size-1.5 rounded-full bg-emphasis" />
                    <span className="font-medium text-emphasis w-20">Cuma</span>
                    <span className="rounded bg-default px-2 py-1 text-emphasis border border-subtle">
                      09:00 - 20:30
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-subtle">
                    <span className="text-[11px] text-subtle font-medium">Uzun Seans</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-subtle/50 bg-muted/10 px-3 py-1.5 opacity-60">
                  <div className="flex items-center gap-3">
                    <span className="size-1.5 rounded-full bg-subtle" />
                    <span className="font-medium text-subtle w-20">Pazar</span>
                    <span className="text-subtle">Uygun değil (Haftalık İzin)</span>
                  </div>
                </div>
              </div>

              {/* Tarih Üzerine Yazmaları (Özel Gün / Bayram) */}
              <div className="rounded-xl border border-subtle bg-default p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emphasis text-xs">
                    Tarih Üzerine Yazmaları (Özel Günler & Tatiller)
                  </span>
                  <span className="text-[11px] text-subtle">+ Yeni Gün Kapat</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between rounded-md border border-subtle bg-muted/30 px-2.5 py-1.5 text-xs text-subtle">
                    <span className="font-medium text-emphasis">28-29 Ekim (Cumhuriyet Bayramı)</span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-subtle">
                      Randevulara Kapalı
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-md border border-subtle bg-muted/30 px-2.5 py-1.5 text-xs text-subtle">
                    <span className="font-medium text-emphasis">14 Kasım (Kişisel Yıl Dönümü & İzin)</span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-subtle">
                      Randevulara Kapalı
                    </span>
                  </div>
                </div>
              </div>

              {/* Takvim Senkron Göstergesi */}
              <div className="flex items-center justify-between rounded-lg bg-muted/40 p-2.5 text-xs text-subtle border border-subtle/60">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emphasis" />
                  <span>Google Takvim & Apple Calendar'a Anlık İletim</span>
                </div>
                <span className="font-mono text-[11px]">Otomatik Senkron</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. BLOK: GÜVENLİK, KRİZ VE NO-SHOW KORUMASI */}
      {/* ========================================================= */}
      <section aria-labelledby="safety-heading" className="scroll-mt-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Sol: Mockup (Screenshot 1 & Ofis Dışında Gerçek Ekranlar) */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative rounded-2xl border border-subtle bg-default p-6 sm:p-8 shadow-xl space-y-6">
              {/* Üst Modül Değiştirici: 1. Randevular & No-Show | 2. Ofis Dışında */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-subtle pb-5 gap-3">
                <div className="inline-flex items-center gap-1.5 rounded-xl bg-muted/50 p-1.5 border border-subtle">
                  <button
                    type="button"
                    onClick={() => setBlock2Mode("bookings")}
                    className={classNames(
                      "rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all",
                      block2Mode === "bookings"
                        ? "bg-default text-emphasis shadow-sm"
                        : "text-subtle hover:text-emphasis hover:bg-muted/40"
                    )}>
                    Randevular & No-Show
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlock2Mode("ooo")}
                    className={classNames(
                      "rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2",
                      block2Mode === "ooo"
                        ? "bg-default text-emphasis shadow-sm"
                        : "text-subtle hover:text-emphasis hover:bg-muted/40"
                    )}>
                    <span>Ofis Dışında (İzin & Acil Durum)</span>
                    <span className="size-2 rounded-full bg-emphasis" />
                  </button>
                </div>
                <span className="text-[11px] text-subtle font-mono hidden sm:inline">
                  Yönetim Paneli Görünümü
                </span>
              </div>

              {/* 1. GÖRÜNÜM: REZERVASYONLAR & NO-SHOW (Screenshot 1) */}
              {block2Mode === "bookings" && (
                <div className="space-y-5">
                  <div className="rounded-xl border border-subtle bg-default overflow-hidden text-xs shadow-sm">
                    {/* Rezervasyonlar Başlık & Açıklama */}
                    <div className="border-subtle border-b bg-muted/20 p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold font-cal text-emphasis text-sm">Rezervasyonlar</h3>
                        <div className="flex items-center gap-1.5 text-[11px] text-subtle">
                          <span className="size-2 rounded-full bg-emphasis" />
                          <span>Canlı Randevu Listesi</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-subtle">
                        Etkinlik türleri bağlantılarınızla rezervasyon yaptığınız yaklaşan ve geçmiş
                        etkinlikleri görün.
                      </p>
                    </div>

                    {/* Sekmeler & Filtreler */}
                    <div className="border-subtle border-b p-2.5 flex items-center justify-between overflow-x-auto gap-2 bg-default">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setActiveTab("yaklasan")}
                          className={classNames(
                            "rounded-md px-2.5 py-1 font-medium text-[11px] transition",
                            activeTab === "yaklasan"
                              ? "bg-emphasis text-default shadow-xs"
                              : "text-subtle hover:text-emphasis hover:bg-muted/40"
                          )}>
                          Yaklaşan
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab("onaylanmadi")}
                          className={classNames(
                            "rounded-md px-2.5 py-1 font-medium text-[11px] transition",
                            activeTab === "onaylanmadi"
                              ? "bg-emphasis text-default shadow-xs"
                              : "text-subtle hover:text-emphasis hover:bg-muted/40"
                          )}>
                          Onaylanmadı
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab("yinelenen")}
                          className="rounded-md px-2.5 py-1 font-medium text-[11px] text-subtle hover:text-emphasis hover:bg-muted/40 transition">
                          Yinelenen
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab("gecmis")}
                          className="rounded-md px-2.5 py-1 font-medium text-[11px] text-subtle hover:text-emphasis hover:bg-muted/40 transition">
                          Geçmiş
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab("iptal")}
                          className="rounded-md px-2.5 py-1 font-medium text-[11px] text-subtle hover:text-emphasis hover:bg-muted/40 transition">
                          İptal edildi
                        </button>
                      </div>

                      <div className="hidden sm:flex items-center gap-1 text-[11px] text-subtle border border-subtle rounded-md px-2 py-1">
                        <span>Kaydedilmiş filtreler</span>
                        <ChevronDown className="size-3" />
                      </div>
                    </div>

                    {/* Randevu Grupları: BUGÜN ve İLERİ */}
                    <div className="p-3.5 space-y-3.5 bg-default">
                      {/* BUGÜN */}
                      <div className="space-y-1.5">
                        <span className="font-semibold text-[11px] text-subtle uppercase tracking-wider">
                          BUGÜN
                        </span>

                        <div className="relative rounded-lg border border-subtle bg-muted/10 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/20 transition">
                          <div className="flex items-start sm:items-center gap-3">
                            <div className="text-left w-24 shrink-0">
                              <div className="font-semibold text-emphasis text-xs">Cum, 25 Eyl</div>
                              <div className="text-[11px] text-subtle">16:45 - 17:30</div>
                            </div>

                            <div className="space-y-0.5">
                              <div className="font-medium text-emphasis text-xs flex items-center gap-2 flex-wrap">
                                <span>
                                  Dr. Zeynep Kaya ve Ahmet Yılmaz arasındaki Online Bireysel Görüşme
                                </span>
                                {isNoShowMarked && (
                                  <span className="rounded border border-subtle bg-muted/40 px-1.5 py-0.5 text-[10px] font-semibold text-emphasis">
                                    Katılmadı (No-Show)
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-subtle">Siz ve Ahmet Yılmaz</div>
                            </div>
                          </div>

                          {/* Menü Butonu (···) */}
                          <div className="relative self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                              className="rounded-md border border-subtle bg-default p-1.5 text-subtle hover:text-emphasis hover:bg-muted/50 transition">
                              <MoreHorizontal className="size-4" />
                            </button>

                            {/* Açılır Menü */}
                            {isActionMenuOpen && (
                              <div className="absolute right-0 top-8 z-30 w-52 rounded-xl border border-subtle bg-default p-1.5 shadow-xl text-xs space-y-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsNoShowMarked(!isNoShowMarked);
                                    setIsActionMenuOpen(false);
                                  }}
                                  className="w-full rounded-md px-2.5 py-1.5 text-left font-medium text-emphasis hover:bg-muted/40 transition flex items-center gap-2">
                                  <UserX className="size-3.5 text-subtle" />
                                  <span>
                                    {isNoShowMarked ? "İşareti Kaldır" : "Katılmadı Olarak İşaretle"}
                                  </span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setIsActionMenuOpen(false)}
                                  className="w-full rounded-md px-2.5 py-1.5 text-left font-medium text-subtle hover:text-emphasis hover:bg-muted/40 transition flex items-center gap-2">
                                  <RefreshCw className="size-3.5 text-subtle" />
                                  <span>Yeniden Planla</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setIsActionMenuOpen(false)}
                                  className="w-full rounded-md px-2.5 py-1.5 text-left font-medium text-subtle hover:text-emphasis hover:bg-muted/40 transition flex items-center gap-2">
                                  <CalendarOff className="size-3.5 text-subtle" />
                                  <span>Rezervasyonu İptal Et</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* İLERİ */}
                      <div className="space-y-1.5 pt-1">
                        <span className="font-semibold text-[11px] text-subtle uppercase tracking-wider">
                          İLERİ
                        </span>

                        <div className="rounded-lg border border-subtle bg-muted/10 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/20 transition">
                          <div className="flex items-start sm:items-center gap-3">
                            <div className="text-left w-24 shrink-0">
                              <div className="font-semibold text-emphasis text-xs">Pts, 28 Eyl</div>
                              <div className="text-[11px] text-subtle">12:00 - 12:45</div>
                            </div>

                            <div className="space-y-0.5">
                              <div className="font-medium text-emphasis text-xs">
                                Dr. Zeynep Kaya ve Canan Öztürk arasındaki Online Bireysel Görüşme
                              </div>
                              <div className="text-[11px] text-subtle">Siz ve Canan Öztürk</div>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="rounded-md border border-subtle bg-default p-1.5 text-subtle hover:text-emphasis self-end sm:self-center">
                            <MoreHorizontal className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Alt Sayfalama */}
                    <div className="border-subtle border-t bg-muted/20 px-4 py-2 flex items-center justify-between text-[11px] text-subtle">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded border border-subtle bg-default px-1.5 py-0.5 font-medium text-emphasis">
                          10 ▾
                        </span>
                        <span>sayfa başına satır</span>
                      </div>
                      <div>2 içinden 1-2</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg bg-muted/20 p-3 text-[11px] text-subtle border border-subtle/60">
                    <ShieldCheck className="size-4 text-emphasis shrink-0" />
                    <span>
                      Mazeretsiz gelmeyen danışanları tek tıkla işaretleyin; bir sonraki rezervasyonda sistem
                      sizi uyarır.
                    </span>
                  </div>
                </div>
              )}

              {/* 2. GÖRÜNÜM: OFİS DIŞINDA (Screenshot 18-09-55, 18-06-58, 18-09-05) */}
              {block2Mode === "ooo" && (
                <div className="space-y-6">
                  {/* Yönetim Paneli: Ofis Dışında Listesi (Screenshot 18-09-55) */}
                  <div className="rounded-xl border border-subtle bg-default overflow-hidden text-xs shadow-sm">
                    {/* Header */}
                    <div className="border-subtle border-b bg-muted/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold font-cal text-emphasis text-sm">Ofis Dışında</h3>
                        <p className="text-[11px] text-subtle">
                          Rezervasyon yapanlara ofis dışında olduğunuzu bildirin.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-lg border border-subtle bg-default p-0.5 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setOooTab("mine")}
                            className={classNames(
                              "rounded px-2.5 py-1 font-medium transition",
                              oooTab === "mine"
                                ? "bg-emphasis text-default shadow-xs"
                                : "text-subtle hover:text-emphasis"
                            )}>
                            İzinlerim
                          </button>
                          <button
                            type="button"
                            onClick={() => setOooTab("holidays")}
                            className={classNames(
                              "rounded px-2.5 py-1 font-medium transition",
                              oooTab === "holidays"
                                ? "bg-emphasis text-default shadow-xs"
                                : "text-subtle hover:text-emphasis"
                            )}>
                            Tatil günleri
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsOooModalOpen(true)}
                          className="inline-flex items-center gap-1 rounded-lg bg-emphasis px-2.5 py-1 font-medium text-default text-[11px] hover:opacity-90 transition shadow-xs">
                          <Plus className="size-3.5" />
                          <span>Ekle</span>
                        </button>
                      </div>
                    </div>

                    {/* Arama & Filtre Çubuğu */}
                    <div className="border-subtle border-b p-2.5 flex items-center justify-between gap-2 bg-default text-[11px]">
                      <div className="flex items-center gap-2 flex-1 max-w-xs rounded-md border border-subtle px-2.5 py-1 text-subtle">
                        <Search className="size-3" />
                        <span>Ara</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          className="rounded-md border border-subtle px-2 py-1 text-subtle hover:text-emphasis flex items-center gap-1">
                          <Filter className="size-3" />
                          <span>Filtrele</span>
                        </button>
                        <div className="hidden sm:flex items-center gap-1 text-subtle border border-subtle rounded-md px-2 py-1">
                          <span>Kaydedilmiş filtreler</span>
                          <ChevronDown className="size-3" />
                        </div>
                      </div>
                    </div>

                    {/* Liste Kartı */}
                    <div className="p-4 bg-default space-y-2.5">
                      <div className="text-[11px] font-semibold text-subtle">Ofis Dışında (1)</div>

                      {/* Kayıt Satırı */}
                      <div className="flex items-start justify-between rounded-lg border border-subtle bg-muted/10 p-3.5 hover:bg-muted/20 transition gap-3">
                        <div className="flex items-start gap-3">
                          {/* Rozet */}
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted border border-subtle text-sm">
                            🏖️
                          </div>

                          <div className="space-y-0.5">
                            <div className="font-semibold text-emphasis text-xs">
                              25 Eyl 2026 - 27 Eyl 2026
                            </div>
                            <div className="text-[11px] text-subtle">Yönlendirme yok</div>
                            <p className="text-[11px] text-subtle leading-relaxed mt-1">
                              <span className="font-medium text-emphasis">Notlar:</span> Kongre Katılımı &
                              Yıllık İzin nedeniyle seans yapılamamaktadır; acil durumlarda kliniğimize
                              ulaşabilirsiniz.
                            </p>
                          </div>
                        </div>

                        {/* Aksiyon İkonları */}
                        <div className="flex items-center gap-1 text-subtle shrink-0">
                          <button
                            type="button"
                            onClick={() => setIsOooModalOpen(true)}
                            className="rounded p-1 hover:text-emphasis hover:bg-muted/50 transition">
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            className="rounded p-1 hover:text-emphasis hover:bg-muted/50 transition">
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Alt Çubuk */}
                    <div className="border-subtle border-t bg-muted/20 px-4 py-2 text-[10px] text-subtle">
                      Loaded 1 of 1
                    </div>
                  </div>

                  {/* Danışan Randevu Ekranı Önizlemesi (Geniş ve Ayrı Kart) */}
                  <div className="mt-8 pt-6 border-t border-subtle space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-semibold text-emphasis text-xs sm:text-sm">
                        <Eye className="size-4 text-subtle" />
                        <span>Danışan Randevu Ekranı Önizlemesi</span>
                      </div>
                      <span className="rounded-full border border-subtle bg-muted/40 px-2.5 py-0.5 text-[11px] font-medium text-subtle">
                        25 Eylül Seçildiğinde
                      </span>
                    </div>

                    <p className="text-xs text-subtle leading-relaxed">
                      Danışanınız takvimde izinli olduğunuz bir güne tıkladığında, saat seçenekleri yerine
                      sistem otomatik olarak bu bilgilendirmeyi gösterir:
                    </p>

                    <div className="rounded-xl border border-subtle bg-muted/20 p-5">
                      <div className="rounded-lg border border-subtle bg-default p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                        {/* Sol: Tarih Seçimi Bilgisi */}
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-emphasis flex items-center gap-2">
                            <span className="size-2 rounded-full bg-emphasis" />
                            <span>Cuma, 25 Eylül 2026</span>
                          </div>
                          <div className="text-[11px] text-subtle">
                            Dr. Zeynep Kaya • Online Bireysel Görüşme (45 dk)
                          </div>
                        </div>

                        {/* Sağ: Danışanın Karşılaştığı İzin Kartı (Screenshot 18-09-05 Birebir) */}
                        <div className="w-full sm:w-72 rounded-lg border border-subtle bg-muted/30 p-3.5 text-center space-y-1.5">
                          <div className="mx-auto flex size-8 items-center justify-center rounded-full bg-muted border border-subtle text-sm">
                            🏖️
                          </div>
                          <div className="font-semibold text-emphasis text-xs">
                            Dr. Zeynep Kaya Ofis Dışında (İzinli) durumunda.
                          </div>
                          <div className="text-[10px] text-subtle italic leading-normal">
                            "Kongre Katılımı & Yıllık İzin nedeniyle seans yapılamamaktadır."
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* OFİS DIŞINDA OL MODAL OVERLAY (Screenshot 18-06-58) */}
              {isOooModalOpen && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 rounded-2xl">
                  <div className="w-full max-w-sm rounded-xl border border-subtle bg-default p-4 shadow-2xl space-y-3.5 text-xs animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between border-b border-subtle pb-2">
                      <h4 className="font-bold text-emphasis text-sm">Ofis Dışında Ol</h4>
                      <button
                        type="button"
                        onClick={() => setIsOooModalOpen(false)}
                        className="rounded p-1 text-subtle hover:text-emphasis">
                        <X className="size-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-medium text-subtle mb-1">Tarihler</label>
                        <div className="flex items-center justify-between rounded-lg border border-subtle bg-muted/20 px-3 py-1.5 text-emphasis">
                          <span>25 Eyl 2026 - 27 Eyl 2026</span>
                          <Calendar className="size-3.5 text-subtle" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-subtle mb-1">Sebep</label>
                        <div className="rounded-lg border border-subtle bg-muted/20 px-3 py-1.5 text-emphasis flex items-center justify-between">
                          <span>🏖️ Tatil & Kongre</span>
                          <ChevronDown className="size-3.5 text-subtle" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-subtle mb-1">Notlar</label>
                        <div className="rounded-lg border border-subtle bg-muted/20 p-2.5 text-subtle text-[11px] leading-relaxed">
                          Kongre Katılımı & Yıllık İzin nedeniyle seans yapılamamaktadır; acil durumlarda
                          kliniğimize başvurabilirsiniz.
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-subtle">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded border-subtle text-emphasis focus:ring-0"
                        />
                        <span>Notu herkese açık rezervasyon sayfasında göster</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 border-t border-subtle pt-3">
                      <button
                        type="button"
                        onClick={() => setIsOooModalOpen(false)}
                        className="rounded-lg px-3 py-1.5 font-medium text-subtle hover:text-emphasis">
                        İptal et
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsOooModalOpen(false)}
                        className="rounded-lg bg-emphasis px-3 py-1.5 font-medium text-default shadow-xs hover:opacity-90">
                        Oluştur
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sağ: Açıklamalar */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-muted/40 px-3 py-1 text-xs font-medium text-subtle">
              <ShieldAlert className="size-3.5 text-emphasis" />
              <span>Kötü Sürprizlere Son</span>
            </div>

            <h2
              id="safety-heading"
              className="font-bold font-cal text-2xl text-emphasis sm:text-3xl leading-snug">
              Sahte randevuları, no-show durumlarını ve son dakika krizlerini önleyin
            </h2>

            <p className="text-sm text-subtle leading-relaxed sm:text-base">
              Randevu almak isteyen kişilerin telefon ve e-posta adreslerini doğrulayarak takviminizin boşa
              kilitlenmesini engelliyoruz. Mazeretsiz gelmeyen danışanları doğrudan yaklaşan randevular
              listesinden tek tıkla "Katılmadı" olarak işaretleyebilir; acil durumlarda veya izinlerinizde tek
              tuşla takvimi kapatıp danışanlarınıza şık bir bilgilendirme iletebilirsiniz.
            </p>

            <div className="space-y-4 pt-2">
              <div className="rounded-xl border border-subtle bg-default/60 p-4">
                <div className="flex items-center gap-2 font-semibold text-emphasis text-sm">
                  <Phone className="size-4 text-emphasis" />
                  <span>Telefon ve E-Posta Doğrulama (OTP)</span>
                </div>
                <p className="mt-1 text-xs text-subtle leading-relaxed">
                  Danışan randevuyu onaylamadan önce telefonuna veya e-postasına giden doğrulama kodunu girmek
                  zorundadır. Böylece sahte numaralar takviminizi kitleyemez.
                </p>
              </div>

              <div className="rounded-xl border border-subtle bg-default/60 p-4">
                <div className="flex items-center gap-2 font-semibold text-emphasis text-sm">
                  <UserX className="size-4 text-emphasis" />
                  <span>Randevu Listesinden "Katılmadı" (No-Show) İşaretleme</span>
                </div>
                <p className="mt-1 text-xs text-subtle leading-relaxed">
                  Ayrı veya karmaşık menülere gerek yok. Yaklaşan randevular ekranınızda randevunun yanındaki
                  menüye (···) tıklayarak danışanı anında "Katılmadı" olarak işaretleyebilirsiniz. Sistem bu
                  kişiyi hafızaya alarak bir sonraki randevu denemesinde sizi önceden uyarır.
                </p>
              </div>

              <div className="rounded-xl border border-subtle bg-default/60 p-4">
                <div className="flex items-center gap-2 font-semibold text-emphasis text-sm">
                  <AlertCircle className="size-4 text-emphasis" />
                  <span>Ofis Dışında (İzin & Acil Durum Yönetimi)</span>
                </div>
                <p className="mt-1 text-xs text-subtle leading-relaxed">
                  Beklenmedik bir hastalıkta, acil durumda veya yıllık izin/kongre katılımında tarih aralığını
                  tek kayıtla kapatın; danışanlarınız rezervasyon sayfasına girdiğinde şık bir izin
                  açıklamasıyla (veya dilerseniz bir meslektaşınıza yönlendirme bağlantısıyla) karşılansın.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. BLOK: İLETİŞİM, OTOMASYON & SÜREKLİLİK */}
      {/* ========================================================= */}
      <section aria-labelledby="automation-heading" className="scroll-mt-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Sol: Açıklamalar */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-muted/40 px-3 py-1 text-xs font-medium text-subtle">
              <MessageSquare className="size-3.5 text-emphasis" />
              <span>Sıfır Manuel İş Yükü</span>
            </div>

            <h2
              id="automation-heading"
              className="font-bold font-cal text-2xl text-emphasis sm:text-3xl leading-snug">
              Otomatik SMS, Google Meet linki ve düzenli randevu abonelikleri
            </h2>

            <p className="text-sm text-subtle leading-relaxed sm:text-base">
              Randevu oluştuktan sonra danışanınıza manuel mesaj atmakla veya toplantı linki oluşturmakla
              vakit kaybetmeyin. Tüm iletişim ve seans sürekliliği arkaplanda otomatik çalışır.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
              <div className="rounded-xl border border-subtle bg-default/60 p-4">
                <div className="flex items-center gap-2 font-semibold text-emphasis text-sm">
                  <MessageSquare className="size-4 text-emphasis" />
                  <span>SMS ve E-posta Bildirimleri</span>
                </div>
                <p className="mt-1.5 text-xs text-subtle leading-relaxed">
                  Randevu anında konfirmasyon, randevu gününden ve saatinden önce otomatik hatırlatıcı SMS.
                </p>
              </div>

              <div className="rounded-xl border border-subtle bg-default/60 p-4">
                <div className="flex items-center gap-2 font-semibold text-emphasis text-sm">
                  <Video className="size-4 text-emphasis" />
                  <span>Otomatik Google Meet</span>
                </div>
                <p className="mt-1.5 text-xs text-subtle leading-relaxed">
                  Online görüşmelerde her randevuya özel Google Meet bağlantısı anında üretilir ve takvime
                  eklenir.
                </p>
              </div>

              <div className="rounded-xl border border-subtle bg-default/60 p-4 sm:col-span-2">
                <div className="flex items-center gap-2 font-semibold text-emphasis text-sm">
                  <Repeat className="size-4 text-emphasis" />
                  <span>Yenilenen Randevu Abonelikleri (Periyodik Seanslar)</span>
                </div>
                <p className="mt-1.5 text-xs text-subtle leading-relaxed">
                  Haftalık veya aylık periyotlarla danışanınızın randevusunu otomatik yineleyin; her hafta
                  tekrar tekrar gün ve saat ayarlama derdi ortadan kalksın.
                </p>
              </div>
            </div>
          </div>

          {/* Sağ: Mockup (Screenshot 8 & 10) */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-subtle bg-default p-5 sm:p-6 shadow-xl space-y-4">
              {/* SMS Bildirimi Balonu */}
              <div className="rounded-xl border border-subtle bg-muted/20 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emphasis flex items-center gap-1.5">
                    <MessageSquare className="size-3.5 text-emphasis" />
                    Otomatik Hatırlatıcı SMS Örneği
                  </span>
                  <span className="text-[10px] text-subtle">Randevuya 2 saat kala</span>
                </div>
                <p className="font-mono text-[11px] text-emphasis bg-default p-3 rounded-lg border border-subtle">
                  "Sayın Ahmet Yılmaz, Dr. Zeynep Kaya ile 14:00'teki görüşmenize 2 saat kalmıştır. Google
                  Meet linkiniz: meet.google.com/ron-devu"
                </p>
              </div>

              {/* Yinelenen Abonelik Kartı */}
              <div className="rounded-xl border border-subtle bg-default p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emphasis flex items-center gap-1.5">
                    <Repeat className="size-3.5 text-emphasis" />
                    Yinelenen Randevu Aboneliği
                  </span>
                  <span className="rounded border border-subtle bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-subtle">
                    Aylık 4 Seans
                  </span>
                </div>
                <p className="text-xs text-subtle">
                  Danışan her hafta Cuma günü 14:00 için abone olur, takvim otomatik ayrılır ve her seans
                  öncesi bildirim gider.
                </p>
              </div>

              {/* Tampon Süre Ayarı (Screenshot 10) */}
              <div className="rounded-xl border border-subtle bg-muted/20 p-3.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-medium text-emphasis">Seanslar Arası Dinlenme (Tampon Süre)</div>
                  <div className="text-[11px] text-subtle">Her görüşmeden sonra dinlenme payı</div>
                </div>
                <span className="rounded-md bg-default border border-subtle px-2.5 py-1 font-semibold text-emphasis">
                  10 Dakika
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. BLOK: PRESTİJ VE KURULUM DESTEĞİ */}
      {/* ========================================================= */}
      <section aria-labelledby="custom-support-heading" className="scroll-mt-20">
        <div className="rounded-3xl border border-subtle bg-default p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-muted/40 px-3 py-1 text-xs font-medium text-subtle">
                <Globe className="size-3.5 text-emphasis" />
                <span>Kendi Markanız & Birebir Kurulum</span>
              </div>

              <h2
                id="custom-support-heading"
                className="font-bold font-cal text-2xl text-emphasis sm:text-3xl leading-snug">
                Kendi alan adınızla kullanın, kurulumda yalnız kalmayın
              </h2>

              <p className="text-sm text-subtle leading-relaxed sm:text-base">
                Randevu sisteminizi yabancı bir adres yerine doğrudan kendi web sitenize veya alan adınıza
                bağlayın (ör: <strong>doktorayse.com</strong>). Ayrıca sistemi kurarken yalnız değilsiniz;
                mesai saatlerinizden kural tanımlamalarınıza kadar sistemi sizinle birlikte hazırlıyoruz.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                <div className="rounded-xl border border-subtle bg-default/60 p-4">
                  <div className="flex items-center gap-2 font-semibold text-emphasis text-sm">
                    <Globe className="size-4 text-emphasis" />
                    <span>Özel Alan Adı (Custom Domain)</span>
                  </div>
                  <p className="mt-1 text-xs text-subtle leading-relaxed">
                    Kendi domaininizden doğrudan randevu aldırın. Prestijinizi ve kurumsal görünümünüzü
                    koruyun.
                  </p>
                </div>

                <div className="rounded-xl border border-subtle bg-default/60 p-4">
                  <div className="flex items-center gap-2 font-semibold text-emphasis text-sm">
                    <Headphones className="size-4 text-emphasis" />
                    <span>Birebir Özel Kurulum</span>
                  </div>
                  <p className="mt-1 text-xs text-subtle leading-relaxed">
                    Sistemde tek başınıza bırakılmıyorsunuz. İhtiyaçlarınıza göre takvim ve kural ayarlarınızı
                    birlikte yapıyoruz.
                  </p>
                </div>
              </div>
            </div>

            {/* Sağ Görsel Kart */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-subtle bg-default p-6 shadow-lg space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-subtle bg-muted/40 text-emphasis">
                    <Globe className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-emphasis text-sm">Alan Adı Durumu</h4>
                    <p className="text-xs text-subtle font-medium">Aktif & SSL Sertifikalı ✓</p>
                  </div>
                </div>

                <div className="rounded-lg border border-subtle bg-muted/20 p-3 font-mono text-xs text-emphasis">
                  https://doktorzeynep.com
                </div>

                <div className="rounded-xl border border-subtle bg-muted/20 p-4 space-y-3 text-xs">
                  <div className="font-semibold text-emphasis flex items-center gap-2">
                    <Headphones className="size-4 text-emphasis" />
                    <span>Öncelikli WhatsApp ve Telefon Desteği</span>
                  </div>
                  <p className="text-subtle text-xs leading-relaxed">
                    Herhangi bir sorunuzda veya özel takvim kuralı isteğinizde doğrudan ekibimizle iletişime
                    geçebilirsiniz:
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <a
                      href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-subtle bg-default px-3 py-1.5 font-medium text-emphasis hover:bg-muted/50 transition shadow-xs text-xs">
                      <Phone className="size-3.5 text-subtle" />
                      <span>{phone}</span>
                    </a>
                    <a
                      href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-subtle bg-default px-3 py-1.5 font-medium text-emphasis hover:bg-muted/50 transition shadow-xs text-xs">
                      <MessageSquare className="size-3.5 text-subtle" />
                      <span>WhatsApp Destek</span>
                    </a>
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-subtle bg-default px-3 py-1.5 font-medium text-emphasis hover:bg-muted/50 transition shadow-xs text-xs">
                      <Mail className="size-3.5 text-subtle" />
                      <span>{email}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
