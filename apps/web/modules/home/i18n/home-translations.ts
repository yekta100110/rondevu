export type Locale = "tr" | "en";

export interface Translations {
  nav: {
    login: string;
    dashboard: string;
  };
  pricing: {
    monthly: {
      name: string;
      price: string;
      period: string;
    };
    yearly: {
      name: string;
      price: string;
      period: string;
    };
  };
  modal: {
    title: string;
    subtitle: string;
    generalSubtitle: string;
    whatsapp: string;
    phone: string;
    email: string;
    close: string;
    whatsappPrefill: (planName: string | null) => string;
    emailSubject: (planName: string | null) => string;
  };
}

export const homeTranslations: Record<Locale, Translations> = {
  tr: {
    nav: {
      login: "Giriş Yap",
      dashboard: "Panele Git",
    },
    pricing: {
      monthly: {
        name: "Aylık Plan",
        price: "990 ₺",
        period: "/ ay",
      },
      yearly: {
        name: "Yıllık Plan",
        price: "9.900 ₺",
        period: "/ yıl",
      },
    },
    modal: {
      title: "İletişime geçin",
      subtitle: "Seçtiğiniz plan hakkında konuşmak için bize ulaşın.",
      generalSubtitle: "Sorularınız için bize doğrudan ulaşabilirsiniz.",
      whatsapp: "WhatsApp'tan yazın",
      phone: "Telefon",
      email: "E-posta",
      close: "Kapat",
      whatsappPrefill: (planName: string | null) =>
        planName
          ? `Merhaba, rOndevu ${planName} hakkında bilgi almak istiyorum.`
          : "Merhaba, rOndevu hakkında bilgi almak istiyorum.",
      emailSubject: (planName: string | null) =>
        planName ? `${planName} - rOndevu` : "rOndevu hakkında bilgi",
    },
  },
  en: {
    nav: {
      login: "Sign In",
      dashboard: "Go to Dashboard",
    },
    pricing: {
      monthly: {
        name: "Monthly Plan",
        price: "990 ₺",
        period: "/ mo",
      },
      yearly: {
        name: "Yearly Plan",
        price: "9.900 ₺",
        period: "/ yr",
      },
    },
    modal: {
      title: "Get in touch",
      subtitle: "Contact us to talk about the plan you selected.",
      generalSubtitle: "Reach us directly with any questions.",
      whatsapp: "Message on WhatsApp",
      phone: "Phone",
      email: "Email",
      close: "Close",
      whatsappPrefill: (planName: string | null) =>
        planName
          ? `Hello, I would like information about the rOndevu ${planName}.`
          : "Hello, I would like information about rOndevu.",
      emailSubject: (planName: string | null) =>
        planName ? `${planName} - rOndevu` : "Question about rOndevu",
    },
  },
};
