export type Locale = "tr" | "en";

export interface Translations {
  nav: {
    features: string;
    howItWorks: string;
    pricing: string;
    faq: string;
    login: string;
    dashboard: string;
    getStarted: string;
    themeSystem: string;
    themeDark: string;
    themeLight: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    liveDemoBadge: string;
  };
  steps: {
    badge: string;
    title: string;
    subtitle: string;
    step1: {
      number: string;
      title: string;
      description: string;
      tag: string;
    };
    step2: {
      number: string;
      title: string;
      description: string;
      tag: string;
    };
    step3: {
      number: string;
      title: string;
      description: string;
      tag: string;
    };
  };
  features: {
    badge: string;
    title: string;
    subtitle: string;
    card1: {
      badge: string;
      title: string;
      description: string;
      points: string[];
    };
    card2: {
      badge: string;
      title: string;
      description: string;
      points: string[];
    };
    card3: {
      badge: string;
      title: string;
      description: string;
      points: string[];
    };
    card4: {
      badge: string;
      title: string;
      description: string;
      points: string[];
    };
  };
  moreFeatures: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  pricing: {
    badge: string;
    title: string;
    subtitle: string;
    billingToggle: {
      monthly: string;
      yearly: string;
      yearlyBadge: string;
    };
    monthly: {
      name: string;
      description: string;
      price: string;
      period: string;
      cta: string;
      features: string[];
    };
    yearly: {
      name: string;
      badge: string;
      description: string;
      price: string;
      period: string;
      cta: string;
      features: string[];
    };
    matrix: {
      title: string;
      subtitle: string;
      featureCol: string;
      monthlyCol: string;
      yearlyCol: string;
      swipeHint: string;
      categories: Array<{
        name: string;
        rows: Array<{
          title: string;
          description: string;
          monthly: string | boolean;
          yearly: string | boolean;
        }>;
      }>;
    };
    detailsButton: string;
    noCardNeeded: string;
  };
  modal: {
    title: string;
    subtitle: string;
    selectedPlan: string;
    price: string;
    chooseChannel: string;
    whatsapp: string;
    phone: string;
    email: string;
    setupNote: string;
    close: string;
    whatsappPrefill: (planName: string) => string;
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      q: string;
      a: string;
    }>;
  };
  cta: {
    title: string;
    subtitle: string;
    button: string;
  };
  footer: {
    rights: string;
    privacy: string;
    terms: string;
    contact: string;
  };
}

export const homeTranslations: Record<Locale, Translations> = {
  tr: {
    nav: {
      features: "Özellikler",
      howItWorks: "Nasıl Çalışır?",
      pricing: "Fiyatlandırma",
      faq: "SSS",
      login: "Giriş Yap",
      dashboard: "Panele Git",
      getStarted: "Hemen Başla",
      themeSystem: "Otomatik (Sistem)",
      themeDark: "Koyu Tema",
      themeLight: "Açık Tema",
    },
    hero: {
      badge: "KOLAY VE NET RANDEVU SİSTEMİ",
      title: "Randevularınızı planlamanın en iyi yolu.",
      subtitle:
        "Danışanlarınız müsait saatlerinizi görsün, tek tıkla randevusunu alsın. Kişisel takviminizle tam senkronize çalışın, sahte randevuları SMS doğrulamasıyla engelleyin.",
      ctaPrimary: "Hemen Başlayın",
      ctaSecondary: "Nasıl Çalışır? ↓",
      liveDemoBadge: "Canlı Randevu Akışı",
    },
    steps: {
      badge: "3 ADIMDA KOLAY BAŞLANGIÇ",
      title: "Bizimle randevu planlamak çok kolay.",
      subtitle: "Bireysel çalışan profesyoneller için zahmetsiz, hızlı ve modern randevu yönetimi.",
      step1: {
        number: "01",
        title: "Takviminizi bağlayın",
        description:
          "Google Takvim veya Apple Calendar hesabınızı bağlayın. Sistem tüm çakışmaları anında kontrol eder, çifte randevuları tamamen önler.",
        tag: "Google & Apple Sync",
      },
      step2: {
        number: "02",
        title: "Müsaitliğinizi belirleyin",
        description:
          "Haftalık çalışma saatlerinizi, randevular arasındaki dinlenme molalarını ve son dakika randevu kurallarını telefonunuzdan ayarlayın.",
        tag: "Mola & Limit Koruması",
      },
      step3: {
        number: "03",
        title: "Görüşme şeklinizi seçin",
        description:
          "İster Google Meet görüntülü görüşme, ister telefon araması veya ofisinizde yüz yüze seans. Linkinizi paylaşın, takviminiz dolsun.",
        tag: "Meet / Telefon / Yüz Yüze",
      },
    },
    features: {
      badge: "ÇEKİRDEK YETENEKLER",
      title: "Tüm ihtiyaçlarınız için tek randevu sistemi.",
      subtitle:
        "Günlük hayatınızı rahatlatacak, randevu karmaşasını ortadan kaldıracak pratik ve güçlü özellikler.",
      card1: {
        badge: "MOLA & TAMPON PAYI",
        title: "Aşırı randevu yükünden kaçının",
        description:
          "Peş peşe seanslara nefes almadan girmeyin. Randevularınızın önüne ve arkasına 10-15 dakikalık dinlenme payı ekleyin, gün ortasında rahatça dinlenin.",
        points: [
          "Otomatik seans öncesi ve sonrası ara süre",
          "Minimum 2 saat öncesinden randevu alma şartı",
          "Günlük randevu sayısı sınırlaması",
        ],
      },
      card2: {
        badge: "KİŞİSEL KİMLİK",
        title: "Size özel randevu bağlantısı",
        description:
          "Uzun ve karmaşık linkleri unutun. rondevu.org/adiniz veya kendi web sitenizin alan adıyla profesyonel bir görünüm kazanın.",
        points: [
          "Özel rondevu.org/adiniz bağlantısı",
          "Kendi alan adınızı (ör. doktorayse.com) bağlama",
          "Tek kullanımlık veya süreli gizli linkler",
        ],
      },
      card3: {
        badge: "KUSURSUZ DENEYİM",
        title: "Danışanlarınız için akıcı akış",
        description:
          "Danışanlarınız üye olmadan, uygulama indirmeden telefonlarından veya bilgisayarlarından saniyeler içinde boş bir saat seçip randevusunu onaylar.",
        points: [
          "Otomatik saat dilimi tespiti",
          "Google & Apple takvim davetiyesi",
          "Mobil uyumlu, şık ve sade tasarım",
        ],
      },
      card4: {
        badge: "SMS & E-POSTA DOĞRULAMA",
        title: "Gelmeyen danışanlara son verin",
        description:
          "Randevu alınırken danışanın telefonuna 6 haneli SMS onay kodu iletilir. Sahte numaralar engellenir, randevudan önce otomatik hatırlatma gider.",
        points: [
          "Kısa mesaj (SMS) ile 6 haneli onay kodu",
          "Randevu öncesi otomatik SMS & e-posta hatırlatma",
          "İptal durumunda danışandan zorunlu neden isteme",
        ],
      },
    },
    moreFeatures: {
      badge: "GELİŞMİŞ STANDARTLAR",
      title: "…ve çok daha fazlası!",
      subtitle: "Gizli ücret veya ek paketler yok. Tüm özellikler hesabınızda standart olarak açıktır.",
      items: [
        {
          title: "Kısa ve Akılda Kalıcı Linkler",
          description: "Danışanlarınızla kolayca paylaşabileceğiniz sade ve şık profil bağlantıları.",
        },
        {
          title: "Gizlilik Önceliği",
          description: "Kişisel e-posta adresinizi ve takvim notlarınızı danışanlardan gizli tutun.",
        },
        {
          title: "Çoklu Dil Desteği (TR / EN)",
          description: "Yurt içi ve yurt dışı danışanlarınız için Türkçe ve İngilizce tam uyumlu arayüz.",
        },
        {
          title: "Kolay Web Entegrasyonu",
          description: "Tek satır kodla web sitenize veya Instagram/WhatsApp biyografinize ekleyin.",
        },
        {
          title: "Tüm Takvim Uygulamaları",
          description: "Google Takvim, Apple Calendar ve Outlook ile kusursuz iki yönlü eşitleme.",
        },
        {
          title: "Kolay Özelleştirme",
          description: "Çalışma saatleri, seans süreleri ve danışan sorularını dilediğiniz gibi düzenleyin.",
        },
      ],
    },
    pricing: {
      badge: "ŞEFFAF VE NET",
      title: "Size uygun planı seçin.",
      subtitle:
        "Randevu başı komisyon veya kilitli özellikler yok. Randevu sistemi her iki pakette de tüm özellikleriyle tam olarak açıktır.",
      billingToggle: {
        monthly: "Aylık",
        yearly: "Yıllık",
        yearlyBadge: "2 Ay Hediye",
      },
      monthly: {
        name: "Aylık Plan",
        description: "Taahhütsüz ve esnek kullanım; dilediğiniz zaman tek tıkla sonlandırın.",
        price: "990 ₺",
        period: "/ ay",
        cta: "Aylık Planı Seç",
        features: [
          "Sınırsız randevu ve hizmet türü",
          "Google ve Apple Takvim eşitleme",
          "SMS ve e-posta ile müşteri doğrulaması",
          "Otomatik SMS ve e-posta hatırlatıcıları",
          "Kendi web adresinizi bağlama (ör. doktorayse.com)",
          "İzin günleri ve mola süreleri yönetimi",
        ],
      },
      yearly: {
        name: "Yıllık Plan",
        badge: "2 Ay Hediye",
        description: "12 ay sabit fiyat garantisi ve kesintisiz kurulum desteği.",
        price: "9.900 ₺",
        period: "/ yıl",
        cta: "Yıllık Planı Seç",
        features: [
          "Aylık plandaki tüm özellikler dahil",
          "2 ay ücretsiz kullanım hediyesi",
          "12 ay boyunca sabit fiyat garantisi",
          "Öncelikli destek ve kurulum yardımı",
        ],
      },
      matrix: {
        title: "Özellikleri Karşılaştırın",
        subtitle: "Aylık ve Yıllık planlar arasındaki tüm yetenekleri ve avantajları inceleyin.",
        featureCol: "Özellikler",
        monthlyCol: "Aylık Plan",
        yearlyCol: "Yıllık Plan",
        swipeHint: "Tüm sütunları görmek için yana kaydırın",
        categories: [
          {
            name: "Çekirdek Randevu Yetenekleri",
            rows: [
              {
                title: "Sınırsız Randevu Türü",
                description:
                  "Farklı seans süreleri ve ihtiyaçlar için dilediğiniz kadar randevu şablonu oluşturun.",
                monthly: "Sınırsız",
                yearly: "Sınırsız",
              },
              {
                title: "Google ve Apple Takvim Eşitleme",
                description:
                  "Kişisel takvimlerinizle çift yönlü anlık senkronizasyon; çifte randevuları %100 önler.",
                monthly: true,
                yearly: true,
              },
              {
                title: "Esnek Seans Süreleri",
                description: "15, 30, 45, 60 dakika veya dilediğiniz özel süre seçenekleri.",
                monthly: true,
                yearly: true,
              },
              {
                title: "Çoklu Görüşme Konumları",
                description: "Google Meet linki, telefon araması veya ofis adresinizde yüz yüze randevu.",
                monthly: true,
                yearly: true,
              },
              {
                title: "Otomatik Saat Dilimi & Çakışma Koruması",
                description:
                  "Yurt içi ve yurt dışı danışanlarınız için yerel saat dilimini otomatik algılar.",
                monthly: true,
                yearly: true,
              },
            ],
          },
          {
            name: "Mola ve Limit Yönetimi",
            rows: [
              {
                title: "Seans Öncesi ve Sonrası Molalar",
                description:
                  "Randevuların arasına nefes payı ve dinlenme süresi ekleyerek yığılmayı önleyin.",
                monthly: true,
                yearly: true,
              },
              {
                title: "Son Dakika Rezervasyon Limiti",
                description:
                  "Minimum 2-4 saat öncesinden randevu alma kuralı koyarak sürprizleri engelleyin.",
                monthly: true,
                yearly: true,
              },
              {
                title: "Günlük / Haftalık Randevu Kotası",
                description:
                  "Gününüzü korumak için bir günde alınabilecek maksimum randevu sayısını sınırlayın.",
                monthly: true,
                yearly: true,
              },
              {
                title: "İzin ve Ofis Dışında Modu",
                description: "Tatillerde veya acil durumlarda takviminizi tek dokunuşla randevuya kapatın.",
                monthly: true,
                yearly: true,
              },
            ],
          },
          {
            name: "Danışan Deneyimi ve Güvenlik",
            rows: [
              {
                title: "6 Haneli SMS / OTP Doğrulaması",
                description:
                  "Randevu sırasında danışanın telefonuna tek kullanımlık onay kodu göndererek sahte kayıtları durdurun.",
                monthly: true,
                yearly: true,
              },
              {
                title: "Otomatik SMS ve E-posta Hatırlatıcıları",
                description:
                  "Randevu öncesinde danışana giden zaman ayarlı hatırlatmalarla gelmeme oranını düşürün.",
                monthly: true,
                yearly: true,
              },
              {
                title: "Zorunlu İptal ve Erteleme Nedeni",
                description: "Danışan randevusunu iptal ederken veya ertelerken zorunlu açıklama isteme.",
                monthly: true,
                yearly: true,
              },
              {
                title: "Özel Danışan Soruları ve Form Alanları",
                description:
                  "Randevu öncesinde danışandan almak istediğiniz detaylı bilgi veya özel not soruları.",
                monthly: true,
                yearly: true,
              },
            ],
          },
          {
            name: "Marka ve Kişiselleştirme",
            rows: [
              {
                title: "Özel Profil Bağlantısı",
                description: "rondevu.org/adiniz formatında şık ve akılda kalıcı kişisel link.",
                monthly: true,
                yearly: true,
              },
              {
                title: "Kendi Alan Adınızı Bağlama",
                description:
                  "Randevu sayfanızı doktorayse.com gibi kendi web adresiniz üzerinden çalıştırma.",
                monthly: true,
                yearly: true,
              },
              {
                title: "Web Sitesi ve Sosyal Medya Entegrasyonu",
                description: "Sitenize tek satır kodla gömme veya Instagram/WhatsApp biyografinize ekleme.",
                monthly: true,
                yearly: true,
              },
              {
                title: "Tek Kullanımlık Gizli Linkler",
                description:
                  "Sadece linki ilettiğiniz kişiye özel, halka açık olmayan geçici rezervasyon linki.",
                monthly: true,
                yearly: true,
              },
            ],
          },
          {
            name: "Avantaj, Garanti ve Destek",
            rows: [
              {
                title: "Ücretsiz Kullanım Hediyesi",
                description: "Yıllık pakette 10 ay ödeyerek 12 ay tam kullanım hakkı.",
                monthly: false,
                yearly: "2 Ay Hediye",
              },
              {
                title: "12 Ay Sabit Fiyat Garantisi",
                description: "Fiyat artışlarından ve enflasyondan etkilenmeyen korumalı tarife.",
                monthly: false,
                yearly: true,
              },
              {
                title: "Kurulum ve Öncelikli Destek",
                description: "Alan adı yönlendirmesi, takvim senkronizasyonu ve açılış ayarlarında destek.",
                monthly: "Standart Destek",
                yearly: "Öncelikli Birebir Destek",
              },
            ],
          },
        ],
      },
      detailsButton: "Dahil Olan Özellikler",
      noCardNeeded: "Kredi kartı gerekmez. Başlamak için bizimle iletişime geçmeniz yeterlidir.",
    },
    modal: {
      title: "Plan Seçimi",
      subtitle: "Hesabınızı hemen açıp profil linkinizi teslim edelim. İletişim kanalını seçin:",
      selectedPlan: "Seçilen Plan",
      price: "Tutar",
      chooseChannel: "Doğrudan İletişime Geçin",
      whatsapp: "WhatsApp ile Yazın",
      phone: "Telefonla Arayın",
      email: "E-posta Gönderin",
      setupNote: "Ekibimiz sisteminizi dakikalar içinde hazırlar ve size özel randevu sayfanızı teslim eder.",
      close: "Kapat",
      whatsappPrefill: (planName: string) =>
        `Merhaba, rOndevu ${planName} hakkında bilgi almak ve hesabımı açtırmak istiyorum.`,
    },
    faq: {
      badge: "MERAK EDİLENLER",
      title: "Sıkça Sorulan Sorular",
      subtitle: "Sistemin çalışması, takvim eşitleme ve özellikler hakkında en çok karşılaştığımız sorular.",
      items: [
        {
          q: "Acil bir durumda veya izne çıktığımda randevuları nasıl yönetirim?",
          a: "İzin modunu açtığınızda o günkü randevularınız iptal edilir ve danışanlarınıza açıklama mesajınız otomatik iletilir.",
        },
        {
          q: "Kendi web sitemin adresini (ör. doktorayse.com) bağlayabilir miyim?",
          a: "Evet, kendi alan adınızı sisteme bağlayabilir ve randevu sayfanızı kendi adresiniz üzerinden kesintisiz kullanabilirsiniz.",
        },
        {
          q: "Danışanların SMS doğrulaması yapması neden gerekli?",
          a: "Randevu öncesi telefona 6 haneli kod gönderilerek sahte veya hatalı numaralarla takviminizin doldurulması önlenir.",
        },
        {
          q: "Google Takvim veya Apple Calendar bağlantısı nasıl çalışıyor?",
          a: "Kişisel takviminizdeki herhangi bir meşguliyet rOndevu'da o saati otomatik kapatır; yeni alınan randevular da takviminize işlenir.",
        },
        {
          q: "Randevu başına komisyon veya gizli ek bir ücret var mı?",
          a: "Hayır, randevu başına komisyon veya gizli ücret yoktur. Seçtiğiniz planda tüm özellikler sınırsız olarak açıktır.",
        },
        {
          q: "Sistemi kullanmak için teknik bilgi gerekiyor mu?",
          a: "Hayır, profiliniz dakikalar içinde hazır hale gelir ve doğrudan kullanmaya başlayabilirsiniz.",
        },
      ],
    },
    cta: {
      title: "Daha akıllı, daha sade randevu.",
      subtitle: "Zamanınızı planlama karmaşasına değil, danışanlarınıza ve işinize ayırın.",
      button: "Hemen Başlayın",
    },
    footer: {
      rights: "Tüm hakları saklıdır.",
      privacy: "Gizlilik Politikası",
      terms: "Kullanım Şartları",
      contact: "İletişim",
    },
  },
  en: {
    nav: {
      features: "Features",
      howItWorks: "How it Works",
      pricing: "Pricing",
      faq: "FAQ",
      login: "Sign In",
      dashboard: "Go to Dashboard",
      getStarted: "Get Started",
      themeSystem: "Auto (System)",
      themeDark: "Dark Mode",
      themeLight: "Light Mode",
    },
    hero: {
      badge: "SIMPLE & CLEAR SCHEDULING",
      title: "The better way to schedule your meetings.",
      subtitle:
        "Let your bookers view your open slots and book in seconds. Stay seamlessly synced with your personal calendar and stop fake bookings with SMS verification.",
      ctaPrimary: "Get Started",
      ctaSecondary: "How it Works ↓",
      liveDemoBadge: "Live Booking Flow",
    },
    steps: {
      badge: "3 SIMPLE STEPS",
      title: "With us, appointment scheduling is easy.",
      subtitle: "Effortless scheduling for professionals, modern simplicity for fast-moving businesses.",
      step1: {
        number: "01",
        title: "Connect your calendar",
        description:
          "Connect Google Calendar or Apple Calendar. We handle all cross-referencing in real time, completely eliminating double bookings.",
        tag: "Google & Apple Sync",
      },
      step2: {
        number: "02",
        title: "Set your availability",
        description:
          "Configure working hours, buffer times between meetings, and last-minute booking limits right from your phone.",
        tag: "Buffers & Limits",
      },
      step3: {
        number: "03",
        title: "Choose how to meet",
        description:
          "Whether it is Google Meet, a phone call, or an in-person meeting. Share your link and watch your schedule fill up smoothly.",
        tag: "Meet / Phone / In-Person",
      },
    },
    features: {
      badge: "CORE CAPABILITIES",
      title: "Your all-purpose scheduling platform.",
      subtitle: "Designed to eliminate booking friction and give you complete control over your schedule.",
      card1: {
        badge: "BUFFERS & LIMITS",
        title: "Avoid meeting overload",
        description:
          "Never rush into back-to-back calls without a break. Add 10-15 minute buffers before and after meetings to stay refreshed.",
        points: [
          "Automatic buffers before and after events",
          "Minimum 2-hour notice requirement",
          "Daily meeting limits to protect your focus",
        ],
      },
      card2: {
        badge: "CUSTOM IDENTITY",
        title: "Stand out with a custom booking link",
        description:
          "Say goodbye to long, messy URLs. Use rondevu.org/yourname or connect your own domain for a polished, professional brand.",
        points: [
          "Clean rondevu.org/yourname booking link",
          "Connect your custom domain (e.g. yourname.com)",
          "Single-use or expiring private links",
        ],
      },
      card3: {
        badge: "SEAMLESS EXPERIENCE",
        title: "Streamline your bookers’ experience",
        description:
          "Your clients book in seconds without downloading apps or creating accounts. Clean, responsive, and available anywhere.",
        points: [
          "Automatic timezone detection",
          "Instant calendar invitations (Google, Apple, Outlook)",
          "Mobile-first, lightning-fast design",
        ],
      },
      card4: {
        badge: "SMS & EMAIL VERIFICATION",
        title: "Reduce no-shows with automated reminders",
        description:
          "Bookers verify their identity with a 6-digit SMS code. Fake submissions are blocked, and timely reminders keep attendance high.",
        points: [
          "6-digit phone verification (SMS code)",
          "Automated SMS & email reminders before meetings",
          "Require a reason if an attendee reschedules or cancels",
        ],
      },
    },
    moreFeatures: {
      badge: "EXPANDED SUITE",
      title: "…and so much more!",
      subtitle: "No hidden fees or locked tiers. All features are fully included out of the box.",
      items: [
        {
          title: "Short Booking Links",
          description: "Clean, memorable URLs that are easy to share via text, social media, or bio.",
        },
        {
          title: "Privacy First",
          description: "Keep your personal email and internal calendar notes completely hidden.",
        },
        {
          title: "Bilingual Ready (TR / EN)",
          description: "Full Turkish and English support for your local and international clients.",
        },
        {
          title: "Easy Embeds",
          description: "Embed seamlessly into your website, bio, or portal with a single line of code.",
        },
        {
          title: "All Your Calendars",
          description: "Two-way real-time synchronization with Google Calendar, Apple, and Outlook.",
        },
        {
          title: "Simple Customization",
          description: "Easily adjust meeting durations, question forms, and custom confirmation screens.",
        },
      ],
    },
    pricing: {
      badge: "TRANSPARENT & SIMPLE",
      title: "Choose your rOndevu plan.",
      subtitle:
        "No per-booking fees or hidden commissions. All scheduling capabilities are unlocked in both plans.",
      billingToggle: {
        monthly: "Monthly",
        yearly: "Yearly",
        yearlyBadge: "2 Months Free",
      },
      monthly: {
        name: "Monthly Plan",
        description: "Flexible, month-to-month access. Cancel anytime with a single click.",
        price: "990 ₺",
        period: "/ mo",
        cta: "Select Monthly",
        features: [
          "Unlimited bookings and event types",
          "Google & Apple Calendar sync",
          "SMS & email client verification",
          "Automated SMS and email reminders",
          "Connect your custom domain (e.g. yourname.com)",
          "Time-off and buffer time management",
        ],
      },
      yearly: {
        name: "Yearly Plan",
        badge: "2 Months Free",
        description: "12-month price guarantee with 2 months free and priority onboarding.",
        price: "9.900 ₺",
        period: "/ yr",
        cta: "Select Yearly",
        features: [
          "Everything in the Monthly Plan",
          "2 months free usage gift",
          "12-month fixed price guarantee",
          "Priority onboarding and setup assistance",
        ],
      },
      matrix: {
        title: "Compare Plan Features",
        subtitle: "Review all scheduling capabilities and advantages across our Monthly and Yearly plans.",
        featureCol: "Features",
        monthlyCol: "Monthly Plan",
        yearlyCol: "Yearly Plan",
        swipeHint: "Swipe sideways to see all columns",
        categories: [
          {
            name: "Core Scheduling Capabilities",
            rows: [
              {
                title: "Unlimited Event Types",
                description: "Create as many booking templates as you need for different meeting types.",
                monthly: "Unlimited",
                yearly: "Unlimited",
              },
              {
                title: "Google & Apple Calendar Sync",
                description: "Real-time two-way synchronization to completely eliminate double bookings.",
                monthly: true,
                yearly: true,
              },
              {
                title: "Flexible Durations",
                description: "15, 30, 45, 60 minutes or customizable session length options.",
                monthly: true,
                yearly: true,
              },
              {
                title: "Multiple Meeting Locations",
                description: "Google Meet link, phone call, or in-person office address.",
                monthly: true,
                yearly: true,
              },
              {
                title: "Automatic Timezone & Conflict Shield",
                description: "Auto-detect attendee timezones and prevent any schedule overlapping.",
                monthly: true,
                yearly: true,
              },
            ],
          },
          {
            name: "Buffers & Limit Management",
            rows: [
              {
                title: "Buffers Before & After Meetings",
                description: "Add automatic break buffers between sessions to stay refreshed.",
                monthly: true,
                yearly: true,
              },
              {
                title: "Minimum Notice Requirements",
                description: "Require at least 2-4 hours notice to prevent unexpected last-minute surprises.",
                monthly: true,
                yearly: true,
              },
              {
                title: "Daily / Weekly Booking Limits",
                description: "Cap the maximum number of daily appointments to protect your focus.",
                monthly: true,
                yearly: true,
              },
              {
                title: "Time-off & Vacation Mode",
                description: "Instantly pause slots and notify clients during holidays or emergencies.",
                monthly: true,
                yearly: true,
              },
            ],
          },
          {
            name: "Client Experience & Verification",
            rows: [
              {
                title: "6-Digit SMS / OTP Verification",
                description: "Send a 6-digit one-time passcode to client phones to block spam bookings.",
                monthly: true,
                yearly: true,
              },
              {
                title: "Automated SMS & Email Reminders",
                description: "Send automated reminders before sessions to maximize client attendance.",
                monthly: true,
                yearly: true,
              },
              {
                title: "Mandatory Cancellation / Reschedule Reason",
                description: "Require a reason whenever an attendee cancels or reschedules a booking.",
                monthly: true,
                yearly: true,
              },
              {
                title: "Custom Booking Questions & Forms",
                description: "Collect essential client information and notes before confirming slots.",
                monthly: true,
                yearly: true,
              },
            ],
          },
          {
            name: "Branding & Customization",
            rows: [
              {
                title: "Custom Profile URL",
                description: "Clean, memorable link formatted as rondevu.org/yourname.",
                monthly: true,
                yearly: true,
              },
              {
                title: "Custom Domain Connection",
                description: "Run your booking page directly under your own domain (e.g. drsmith.com).",
                monthly: true,
                yearly: true,
              },
              {
                title: "Embed & Social Links",
                description: "Embed seamlessly into your website or paste into your Instagram/WhatsApp bio.",
                monthly: true,
                yearly: true,
              },
              {
                title: "Single-Use Private Links",
                description: "Generate private, non-public booking links for selective client invites.",
                monthly: true,
                yearly: true,
              },
            ],
          },
          {
            name: "Guarantee, Value & Support",
            rows: [
              {
                title: "Bonus Months Free",
                description: "Get 12 full months of access while only paying for 10 on the annual plan.",
                monthly: false,
                yearly: "2 Months Free",
              },
              {
                title: "12-Month Fixed Price Guarantee",
                description: "Lock in your subscription rate protected against price changes.",
                monthly: false,
                yearly: true,
              },
              {
                title: "Setup & Onboarding Support",
                description: "Dedicated assistance with domain mapping, calendar syncing, and initial setup.",
                monthly: "Standard Support",
                yearly: "Priority 1-on-1 Support",
              },
            ],
          },
        ],
      },
      detailsButton: "Included Features",
      noCardNeeded: "No credit card needed. Simply reach out to our team to get started.",
    },
    modal: {
      title: "Plan Selection",
      subtitle:
        "We'll activate your account and deliver your personal link right away. Choose how you'd like to reach us:",
      selectedPlan: "Selected Plan",
      price: "Price",
      chooseChannel: "Contact Us Directly",
      whatsapp: "Chat on WhatsApp",
      phone: "Call by Phone",
      email: "Send an Email",
      setupNote: "Our team sets up your account and personal booking link within minutes.",
      close: "Close",
      whatsappPrefill: (planName: string) =>
        `Hello, I would like to get information about the rOndevu ${planName} and set up my account.`,
    },
    faq: {
      badge: "FAQ",
      title: "Frequently Asked Questions",
      subtitle: "Answers to common questions about calendar synchronization, rules, and setup.",
      items: [
        {
          q: "How do I handle emergencies or vacations?",
          a: "Turning on time-off mode pauses your schedule, closes available slots, and optionally notifies affected clients.",
        },
        {
          q: "Can I connect my own custom domain (e.g. drsmith.com)?",
          a: "Yes, you can easily map your custom domain and run your booking page under your personal brand.",
        },
        {
          q: "Why is SMS verification required for bookers?",
          a: "A 6-digit code is sent to the client's phone before confirmation, preventing fake submissions and empty slots.",
        },
        {
          q: "How does the calendar synchronization work?",
          a: "Any personal event in your Google or Apple Calendar instantly blocks that time in rOndevu, eliminating conflicts.",
        },
        {
          q: "Is there any commission or per-booking fee?",
          a: "None. You keep 100% of your business; there are no hidden fees or per-appointment charges.",
        },
        {
          q: "Do I need technical skills to get started?",
          a: "Not at all. Your profile is ready in minutes, and our team is always on hand to assist.",
        },
      ],
    },
    cta: {
      title: "Smarter, simpler scheduling.",
      subtitle: "Spend your time connecting with clients and doing what you do best, not juggling emails.",
      button: "Get Started Now",
    },
    footer: {
      rights: "All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      contact: "Contact",
    },
  },
};
