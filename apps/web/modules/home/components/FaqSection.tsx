"use client";

import classNames from "@calcom/ui/classNames";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: "Acil bir durumda veya izne çıktığımda randevuları nasıl yönetirim?",
      answer:
        "İzin modunu açtığınızda o günkü randevularınız iptal edilir ve danışanlarınıza açıklama mesajınız otomatik iletilir.",
    },
    {
      question: "Kendi web sitemin adresini (ör. doktorayse.com) bağlayabilir miyim?",
      answer:
        "Evet, kendi alan adınızı sisteme bağlayabilir ve randevu sayfanızı kendi adresiniz üzerinden kesintisiz kullanabilirsiniz.",
    },
    {
      question: "Randevusuna gelmeyen kişileri nasıl takip ederim?",
      answer:
        "Gelmeyen danışanları tek tıkla işaretleyebilirsiniz; aynı kişi tekrar randevu almak istediğinde sistem sizi önceden uyarır.",
    },
    {
      question: "Danışanların telefon veya e-posta doğrulaması yapması neden gerekli?",
      answer:
        "Randevu öncesi telefona doğrulama kodu gönderilerek sahte veya hatalı numaralarla takviminizin doldurulması önlenir.",
    },
    {
      question: "Google Takvim veya Apple Calendar bağlantısı nasıl çalışıyor?",
      answer:
        "Alınan tüm randevular anında telefonunuzdaki takvime işlenir, böylece saat çakışması yaşamazsınız.",
    },
    {
      question: "Haftalık veya aylık periyodik randevular oluşturabilir miyim?",
      answer:
        "Evet, düzenli danışanlarınız için haftalık veya aylık yinelenen seanslar tanımlayabilir; her randevu öncesi otomatik hatırlatma iletebilirsiniz.",
    },
    {
      question: "Sistemi kullanmak için teknik bilgi gerekiyor mu?",
      answer:
        "Hayır, çalışma saatlerinizi ve takviminizi dakikalar içinde ayarlayabilirsiniz. İhtiyaç duyduğunuz her an ekibimiz destek vermeye hazırdır.",
    },
    {
      question: "Randevu başına komisyon veya gizli ek bir ücret var mı?",
      answer:
        "Hayır, randevu başına komisyon veya gizli ücret yoktur. Tüm özellikler seçtiğiniz planda eksiksiz olarak kullanıma açıktır.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section aria-labelledby="faq-title" className="border-subtle/80 border-t py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-12">
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
