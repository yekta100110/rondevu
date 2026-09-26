"use client";

import classNames from "@calcom/ui/classNames";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: "Acil bir hastalık veya kaza durumunda (Out of Office) randevuları nasıl yönetirim?",
      answer:
        "Panelinizden 'Out of Office' (Acil Durum / Hastalık) modunu açtığınızda, seçtiğiniz tarihteki tüm randevular anında iptal edilir. Sistem, randevu sahiplerine sizin belirlediğiniz bir açıklama mesajını (örneğin 'Doktor rahatsızlığı nedeniyle randevunuz iptal edilmiştir') SMS ve e-posta ile otomatik ve toplu olarak gönderir.",
    },
    {
      question: "Kendi özel web sitemin alan adını (ör. doktorayse.com) bağlayabilir miyim?",
      answer:
        "Evet. Sizin karmaşık DNS ayarlarıyla veya teknik detaylarla uğraşmanıza gerek yok; kullanmak istediğiniz alan adını bize iletmeniz yeterli. Alan adı yönlendirmesini, sistem bağlantısını ve güvenli SSL sertifikası kurulumunu anahtar teslim olarak biz yapıyoruz. Randevu arayüzünüz doğrudan kendi markanız veya web sitenizin bir parçası (örneğin randevu.kliniginiz.com veya doktorayse.com) olarak prestijle çalışır.",
    },
    {
      question: "Randevusuna mazeretsiz gelmeyen (No-Show) kişileri nasıl engellerim?",
      answer:
        "Randevusuna katılmayan danışanları panelinizden tek tıkla 'Katılmadı' olarak işaretleyebilirsiniz. Bu kişi ileride aynı telefon numarası veya e-posta adresiyle tekrar randevu almaya kalktığında sistem sizi önceden uyarır ve onayınıza sunar.",
    },
    {
      question: "Danışanların telefon veya e-posta doğrulaması (OTP) yapması neden önemli?",
      answer:
        "İnternet ortamında sahte numaralarla veya yanlış yazılan e-postalarla takvimin kilitlenmesi sık yaşanan bir sorundur. Sistemimiz, randevu onaylanmadan önce ilgili numaraya/e-postaya tek kullanımlık doğrulama kodu gönderir; böylece sadece gerçek ve ulaşılabilir danışanlar takviminizden yer alabilir.",
    },
    {
      question: "Google Takvim veya Apple Calendar entegrasyonu nasıl çalışıyor?",
      answer:
        "Oluşturulan tüm randevular anlık olarak Google Takvim ve Apple Calendar uygulamanıza aktarılır; görüşmelerinizi doğrudan kendi takviminizden takip edersiniz.",
    },
    {
      question: "Haftalık veya aylık periyodik seanslar (randevu abonelikleri) nasıl çalışır?",
      answer:
        "Düzenli terapi, diyet kontrolü veya danışmanlık alan danışanlarınız için yinelenen randevu planı tanımlayabilirsiniz. Danışan her hafta tekrar saat aramak zorunda kalmaz; belirlenen gün ve saatte randevuları otomatik açılır ve her seans öncesi bildirimler iletilir.",
    },
    {
      question: "Kurulumu tek başıma mı yapmak zorundayım, teknik bilgi gerekiyor mu?",
      answer:
        "Hayır. Sistemde kesinlikle yalnız bırakılmıyorsunuz. Üyeliğinizin ardından çalışma saatlerinizi, özel tatil günlerinizi, takvim bağlantılarınızı ve varsa özel alan adınızı uzman ekibimizle birlikte birebir yapılandırıyoruz.",
    },
    {
      question: "Farklı paketleriniz, özellik kısıtlamalı planlarınız veya gizli ek ücretler var mı?",
      answer:
        "Hayır. rOndevu'da yapay özellik kısıtlamalı alt/üst paketler bulunmaz. 'Tek fiyata premium erişim' standarttır; yani tüm randevu ve etkinlik türleri, SMS ve e-posta bildirimleri, takvim senkronizasyonları, No-Show ve Out of Office korumaları dahil tüm gelişmiş özellikler her kullanıcımıza eksiksiz açıktır. Randevu başı komisyon veya gizli ücret yoktur; yalnızca seçtiğiniz periyodun sabit bedelini ödersiniz.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section aria-labelledby="faq-title" className="border-subtle/80 border-t py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-subtle bg-muted/40 px-3 py-1 text-xs font-medium text-subtle">
            <HelpCircle className="size-3.5 text-emphasis" />
            <span>Merak Edilenler</span>
          </div>
          <h2 id="faq-title" className="font-bold font-cal text-3xl text-emphasis sm:text-4xl tracking-tight">
            Sıkça Sorulan Sorular
          </h2>
          <p className="mt-3 text-sm text-subtle sm:text-base">
            Sistemin çalışması, kurallar ve teknik detaylar hakkında en çok karşılaştığımız sorular.
          </p>
        </div>

        {/* Akordeon Listesi */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className={classNames(
                  "overflow-hidden rounded-xl border transition-colors",
                  isOpen
                    ? "border-emphasis/40 bg-muted/20"
                    : "border-subtle bg-default hover:border-subtle/80"
                )}>
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-5 text-left transition"
                  aria-expanded={isOpen}>
                  <span className="font-semibold text-emphasis text-sm sm:text-base pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={classNames(
                      "size-5 shrink-0 text-subtle transition-transform duration-200",
                      isOpen ? "rotate-180 text-emphasis" : ""
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}>
                      <div className="px-5 pb-5 text-xs sm:text-sm text-subtle leading-relaxed border-subtle/50 border-t pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
