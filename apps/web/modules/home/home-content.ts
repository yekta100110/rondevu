import type { Locale } from "./i18n/home-translations";

export interface StageCopy {
  host: { name: string; role: string; initials: string; stamp: string; city: string };
  meetingTitle: string;
  agenda: string;
  location: string;
  responseNote: string;
  bookingUrl: string;
  labels: Record<string, string | null>;
}

export interface HomeContent {
  nav: { features: string; how: string; pricing: string; faq: string };
  hero: {
    title: string;
    titleAccent: string;
    subtitle: string;
    primary: string;
    secondary: string;
    note: string;
    altContact: string;
    demoNote: string;
    stage: StageCopy;
  };
  preview: {
    caption: string;
    todayLabel: string;
    dateLabel: string;
    rows: { time: string; name: string; service: string; status: "confirmed" | "pending" }[];
    statusConfirmed: string;
    statusPending: string;
    chatTitle: string;
    chatMessage: string;
    chatTime: string;
    chatReply: string;
  };
  audience: { label: string; items: string[] };
  how: {
    title: string;
    steps: { title: string; body: string }[];
  };
  features: {
    title: string;
    items: { title: string; body: string }[];
  };
  pricing: {
    title: string;
    subtitle: string;
    monthlyLabel: string;
    yearlyLabel: string;
    yearlyNote: string;
    included: string[];
    cta: string;
    detailLink: string;
  };
  faq: { title: string; items: { q: string; a: string }[] };
  cta: { title: string; body: string; button: string };
}

export const homeContent: Record<Locale, HomeContent> = {
  tr: {
    nav: { features: "Özellikler", how: "Nasıl çalışır", pricing: "Fiyat", faq: "Sık sorulanlar" },
    hero: {
      title: "Müşteriniz saatini seçsin,",
      titleAccent: "onay WhatsApp'tan gitsin.",
      subtitle:
        "Klinik, güzellik merkezi, kuaför ve danışmanlık ofisleri için randevu sayfası. Müsait saatlerinizi siz belirlersiniz. Onay, hatırlatma ve iptal mesajları müşterinize WhatsApp ve SMS ile ulaşır.",
      primary: "Bize yazın",
      secondary: "Nasıl çalışır",
      note: "Sorularınızı WhatsApp'tan yanıtlıyoruz.",
      altContact: "Önce bir soru mu var? WhatsApp'tan yazın",
      demoNote: "Bu bir örnek ekran. Girdiğiniz bilgiler kaydedilmez.",
      stage: {
        host: { name: "Ayşe Demir", role: "Güzellik merkezi, örnek", initials: "AD", stamp: "Açık saatler · randevu · ", city: "İstanbul" },
        meetingTitle: "Cilt bakımı",
        agenda: "İlk görüşmede cildinizi birlikte değerlendirir, size uygun bakımı seçeriz.",
        location: "Salonumuzda yüz yüze",
        responseNote: "Onay mesajı WhatsApp'tan gelir",
        bookingUrl: "rondevu.org/ornek-salon",
        labels: {
          pick: "Saat seçin",
          howLong: "Süre",
          minutes: "dk",
          showTimesIn: "Saat dilimi",
          today: "Bugün",
          copyLink: "Bağlantıyı kopyala",
          copied: "Kopyalandı",
          name: "Adınız",
          email: "E-posta",
          note: "Eklemek istediğiniz bir not var mı?",
          optional: "(isteğe bağlı)",
          nameError: "Size nasıl hitap edeceğimizi bilmek için adınızı yazın.",
          emailError: "E-posta adresi eksik görünüyor.",
          bookError: "Bu saat alınamadı. Tekrar deneyin veya başka bir saat seçin.",
          back: "Geri",
          confirm: "Randevuyu onayla",
          sending: "Onaylanıyor…",
          booked: "Randevunuz alındı.",
          invite: null,
          addToCalendar: "Takvime ekle",
          another: "Başka saat seç",
          open: "Boş",
          busy: "Dolu",
          yours: "Alındı",
          timesIn: "Saatler",
          checking: "Müsaitlik kontrol ediliyor…",
          empty: "Bu hafta boş saat yok.",
          nextWeek: "Gelecek haftayı gör",
          now: "şimdi",
          weekOf: "Haftanın başlangıcı:",
          until: "ile",
        },
      },
    },
    preview: {
      caption: "Örnek ekran, kurgusal veriler",
      todayLabel: "Bugün",
      dateLabel: "Salı, 18 Kasım",
      rows: [
        { time: "10:00", name: "Elif Karaca", service: "Cilt bakımı", status: "confirmed" },
        { time: "11:30", name: "Mert Aydın", service: "İlk muayene", status: "confirmed" },
        { time: "13:00", name: "Zeynep Arslan", service: "Saç boyama", status: "pending" },
        { time: "14:30", name: "Burak Şahin", service: "Diyet görüşmesi", status: "confirmed" },
      ],
      statusConfirmed: "WhatsApp onaylı",
      statusPending: "Yanıt bekleniyor",
      chatTitle: "Güzellik merkezi",
      chatMessage:
        "Merhaba Elif, yarın 10:00'daki cilt bakımı randevunuzu aldık. Değiştirmek veya iptal etmek için bağlantıya dokunabilirsiniz.",
      chatTime: "09:41",
      chatReply: "Teşekkürler, görüşürüz",
    },
    audience: {
      label: "Şunlar için hazırlandı",
      items: ["Klinikler", "Güzellik merkezleri", "Kuaför ve berberler", "Danışmanlık ofisleri", "Yerel işletmeler"],
    },
    how: {
      title: "Üç adımda çalışır",
      steps: [
        {
          title: "Saatlerinizi belirleyin",
          body: "Çalışma günlerinizi, randevu sürelerini ve araları girersiniz. Dolu saatler müşteriye hiç gösterilmez.",
        },
        {
          title: "Müşteri bağlantıdan seçer",
          body: "Uygulama indirmesine gerek yok. Müşteri tarayıcıdan boş saati seçer, telefon numarasını SMS koduyla doğrular.",
        },
        {
          title: "Mesajlar kendiliğinden gider",
          body: "Onay, hatırlatma ve iptal bildirimleri WhatsApp ve SMS ile gönderilir. Randevu takviminize de işlenir.",
        },
      ],
    },
    features: {
      title: "Günlük işi hafifleten parçalar",
      items: [
        {
          title: "WhatsApp bildirimleri",
          body: "Müşteri izin verdiyse mesajlar WhatsApp'a gider. STOP, DUR veya İPTAL yazan numaraya sonraki mesajlar gönderilmez.",
        },
        {
          title: "SMS ile numara doğrulama",
          body: "Yanlış veya sahte numarayla alınan randevular azalır. Doğrulama kodu SMS ile gelir.",
        },
        {
          title: "Takvim eşitleme",
          body: "Google, Outlook, Apple ve CalDAV takvimlerinizi bağlayın. Kendi takviminizdeki dolu saatlere randevu verilmez.",
        },
        {
          title: "Görüntülü görüşme",
          body: "Online randevular için Google Meet, Zoom veya rOndevu Video bağlantısı otomatik eklenir.",
        },
        {
          title: "Kendi alan adınız",
          body: "Randevu sayfanızı kendi alan adınızda yayınlayabilirsiniz. Bu seçenek tüm planlarda açıktır.",
        },
      ],
    },
    pricing: {
      title: "İki plan, aynı özellikler",
      subtitle: "Aylık ve yıllık plan arasında tek fark var: yıllıkta 2 ay ücretsiz.",
      monthlyLabel: "Aylık",
      yearlyLabel: "Yıllık",
      yearlyNote: "2 ay ücretsiz",
      included: [
        "Randevu sayfası ve müsaitlik yönetimi",
        "WhatsApp ve SMS bildirimleri",
        "Takvim eşitleme",
        "Özel alan adı",
      ],
      cta: "Planı konuşalım",
      detailLink: "Fiyat sayfası",
    },
    faq: {
      title: "Sık sorulanlar",
      items: [
        {
          q: "Müşterim uygulama indirmek zorunda mı?",
          a: "Hayır. Randevu sayfası tarayıcıda açılır. Telefon numarasını SMS koduyla doğrulaması yeterli.",
        },
        {
          q: "WhatsApp mesajı almak istemeyen müşteriye ne olur?",
          a: "Müşteri STOP, DUR veya İPTAL yazarsa izni geri alınır. O numaraya sonraki WhatsApp mesajları gönderilmez.",
        },
        {
          q: "Kendi takvimimdeki dolu saatlere randevu düşer mi?",
          a: "Takviminizi bağladıysanız düşmez. Dolu saatler müşteriye açılmaz.",
        },
        {
          q: "Aylık ve yıllık plan arasında fark var mı?",
          a: "Özellikler aynı. Yıllık planda 2 ay ücretsiz olur.",
        },
        {
          q: "Verilerim nasıl işleniyor?",
          a: "Ayrıntılar gizlilik politikası ve kullanım koşullarında yer alır. Sorularınız için destek hattımıza yazabilirsiniz.",
        },
      ],
    },
    cta: {
      title: "Randevu takibini bırakın, işinize dönün",
      body: "Sorularınızı WhatsApp'tan yazın, size yardımcı olalım.",
      button: "Bize yazın",
    },
  },
  en: {
    nav: { features: "Features", how: "How it works", pricing: "Pricing", faq: "FAQ" },
    hero: {
      title: "Clients pick their time,",
      titleAccent: "the confirmation goes out on WhatsApp.",
      subtitle:
        "A booking page for clinics, beauty centers, barbers and consulting offices. You set your available hours. Confirmations, reminders and cancellations reach your clients by WhatsApp and SMS.",
      primary: "Contact us",
      secondary: "How it works",
      note: "We answer questions on WhatsApp.",
      altContact: "A question first? Write to us on WhatsApp",
      demoNote: "This is a sample screen. Nothing you enter is saved.",
      stage: {
        host: { name: "Ayşe Demir", role: "Beauty center, sample", initials: "AD", stamp: "Open slots · appointment · ", city: "Istanbul" },
        meetingTitle: "Facial care",
        agenda: "At the first visit we assess your skin together and pick the right treatment.",
        location: "In person at our salon",
        responseNote: "The confirmation arrives on WhatsApp",
        bookingUrl: "rondevu.org/sample-salon",
        labels: {
          pick: "Choose a time",
          howLong: "Length",
          minutes: "min",
          showTimesIn: "Time zone",
          today: "Today",
          copyLink: "Copy link",
          copied: "Copied",
          name: "Your name",
          email: "Email",
          note: "Anything you want to add?",
          optional: "(optional)",
          nameError: "Add your name so we know who to expect.",
          emailError: "That email looks incomplete.",
          bookError: "That slot could not be booked. Try again or pick another time.",
          back: "Back",
          confirm: "Confirm appointment",
          sending: "Confirming…",
          booked: "Your appointment is booked.",
          invite: null,
          addToCalendar: "Add to calendar",
          another: "Pick another time",
          open: "Open",
          busy: "Busy",
          yours: "Booked",
          timesIn: "Times in",
          checking: "Checking availability…",
          empty: "No open slots this week.",
          nextWeek: "See next week",
          now: "now",
          weekOf: "Week of",
          until: "to",
        },
      },
    },
    preview: {
      caption: "Sample screen, fictional data",
      todayLabel: "Today",
      dateLabel: "Tuesday, 18 November",
      rows: [
        { time: "10:00", name: "Elif Karaca", service: "Facial care", status: "confirmed" },
        { time: "11:30", name: "Mert Aydın", service: "First consultation", status: "confirmed" },
        { time: "13:00", name: "Zeynep Arslan", service: "Hair coloring", status: "pending" },
        { time: "14:30", name: "Burak Şahin", service: "Diet session", status: "confirmed" },
      ],
      statusConfirmed: "Confirmed on WhatsApp",
      statusPending: "Awaiting reply",
      chatTitle: "Beauty center",
      chatMessage:
        "Hi Elif, we booked your facial care appointment tomorrow at 10:00. Tap the link to change or cancel it.",
      chatTime: "09:41",
      chatReply: "Thanks, see you",
    },
    audience: {
      label: "Built for",
      items: ["Clinics", "Beauty centers", "Barbers and salons", "Consulting offices", "Local businesses"],
    },
    how: {
      title: "How it works in three steps",
      steps: [
        {
          title: "Set your hours",
          body: "Enter your working days, appointment lengths and breaks. Busy slots are never shown to clients.",
        },
        {
          title: "Clients choose from a link",
          body: "No app to install. Clients pick a free slot in the browser and verify their number with an SMS code.",
        },
        {
          title: "Messages go out on their own",
          body: "Confirmations, reminders and cancellations are sent by WhatsApp and SMS. Appointments also land in your calendar.",
        },
      ],
    },
    features: {
      title: "The parts that lighten the daily work",
      items: [
        {
          title: "WhatsApp notifications",
          body: "Messages go to WhatsApp when the client has opted in. A number that replies STOP, DUR or İPTAL gets no further messages.",
        },
        {
          title: "Number verification by SMS",
          body: "Fewer bookings with wrong or fake numbers. The verification code arrives by SMS.",
        },
        {
          title: "Calendar sync",
          body: "Connect Google, Outlook, Apple and CalDAV calendars. Slots busy in your own calendar are not offered.",
        },
        {
          title: "Video meetings",
          body: "A Google Meet, Zoom or rOndevu Video link is added automatically for online appointments.",
        },
        {
          title: "Your own domain",
          body: "Publish your booking page on your own domain. This option is included in every plan.",
        },
      ],
    },
    pricing: {
      title: "Two plans, same features",
      subtitle: "Monthly and yearly differ in one way only: the yearly plan gives 2 months free.",
      monthlyLabel: "Monthly",
      yearlyLabel: "Yearly",
      yearlyNote: "2 months free",
      included: [
        "Booking page and availability management",
        "WhatsApp and SMS notifications",
        "Calendar sync",
        "Custom domain",
      ],
      cta: "Talk about a plan",
      detailLink: "Pricing page",
    },
    faq: {
      title: "FAQ",
      items: [
        {
          q: "Do clients have to install an app?",
          a: "No. The booking page opens in the browser. Verifying the phone number with an SMS code is enough.",
        },
        {
          q: "What happens if a client does not want WhatsApp messages?",
          a: "If they reply STOP, DUR or İPTAL, consent is withdrawn and no further WhatsApp messages go to that number.",
        },
        {
          q: "Can a booking land on a slot that is busy in my calendar?",
          a: "Not once your calendar is connected. Busy slots are not offered to clients.",
        },
        {
          q: "Is there a difference between the monthly and yearly plan?",
          a: "The features are identical. The yearly plan gives 2 months free.",
        },
        {
          q: "How is my data handled?",
          a: "Details are in the privacy policy and terms of use. You can write to our support line with any question.",
        },
      ],
    },
    cta: {
      title: "Stop chasing appointments, get back to work",
      body: "Write to us on WhatsApp and we will help.",
      button: "Contact us",
    },
  },
};
