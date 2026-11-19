import type { Locale } from "./i18n/home-translations";

export type DemoAppointment = {
  id: string;
  start: number;
  end: number;
  client: string;
  service: string;
  status: "done" | "confirmed" | "pending";
  note: string;
  block?: boolean;
};

export interface HomeContent {
  nav: { product: string; how: string; pricing: string; faq: string; theme: string };
  hero: {
    title: string;
    subtitle: string;
    primary: string;
    secondary: string;
    ringIdle: string;
    ringTomorrow: string;
    ringFree: string;
    ringBooked: string;
  };
  preview: {
    url: string;
    caption: string;
    sidebar: string[];
    today: string;
    newBooking: string;
    stats: { label: string; sub: string }[];
    statFormats: { bookings: string; hours: string; minutes: string };
    timeline: string;
    status: Record<DemoAppointment["status"], string>;
    visit: string;
    time: string;
    duration: string;
    minutes: string;
    confirm: string;
    reschedule: string;
    appointments: DemoAppointment[];
    notifications: { title: string; body: string }[];
    now: string;
  };
  booking: {
    title: string;
    body: string;
    demoNote: string;
    host: { name: string; initials: string; role: string };
    steps: string[];
    services: { id: string; name: string; duration: number; where: string; price: string }[];
    minutes: string;
    next: string;
    back: string;
    pickDay: string;
    dayFull: string;
    nameLabel: string;
    phoneLabel: string;
    phoneHint: string;
    phoneError: string;
    confirm: string;
    doneTitle: string;
    doneBody: string;
    doneService: string;
    doneTime: string;
    doneWhere: string;
    again: string;
    change: string;
  };
  features: { title: string; items: { title: string; body: string }[] };
  how: { title: string; waiting: string; steps: { title: string; body: string; meta: string }[] };
  pricing: {
    title: string;
    subtitle: string;
    monthlyLabel: string;
    yearlyLabel: string;
    yearlyNote: string;
    included: string[];
    cta: string;
    detailLink: string;
    planNote: string;
  };
  faq: { title: string; items: { q: string; a: string }[] };
  cta: { title: string; body: string; button: string; secondary: string };
}

export const homeContent: Record<Locale, HomeContent> = {
  tr: {
    nav: { product: "Ürün", how: "Nasıl çalışır", pricing: "Fiyat", faq: "Sık sorulanlar", theme: "Temayı değiştir" },
    hero: {
      title: "Günün her dakikası yerli yerinde.",
      subtitle:
        "Müsait saatlerinizi tek bağlantıyla paylaşın. Müşteriniz saatini seçer, onay ve hatırlatma WhatsApp ve SMS ile gider.",
      primary: "Bize yazın",
      secondary: "Nasıl çalışır",
      ringIdle: "1440 dakika, tek halkada",
      ringTomorrow: "yarın",
      ringFree: "boş",
      ringBooked: "rezerve edildi",
    },
    preview: {
      url: "app.rondevu.org/bugun",
      caption: "Örnek ekran, kurgusal veriler",
      sidebar: ["Bugün", "Randevular", "Müsaitlik", "Müşteriler", "Ayarlar"],
      today: "Bugün",
      newBooking: "Yeni randevu",
      stats: [
        { label: "Bugün", sub: "2'si tamamlandı" },
        { label: "Dolu süre", sub: "Günün yarısına yakın" },
        { label: "Haftalık doluluk", sub: "Geçen haftadan 9 puan yüksek" },
        { label: "WhatsApp onayı", sub: "Bu hafta gönderilen" },
      ],
      statFormats: { bookings: "randevu", hours: "sa", minutes: "dk" },
      timeline: "Zaman çizelgesi",
      status: { done: "Geldi", confirmed: "Onaylı", pending: "Onay bekliyor" },
      visit: "görüşme",
      time: "Saat",
      duration: "Süre",
      minutes: "dk",
      confirm: "Onayla",
      reschedule: "Yeniden planla",
      appointments: [
        { id: "a1", start: 540, end: 570, client: "Elif Karaca", service: "Cilt bakımı", status: "done", note: "Hassas cilt. Bir sonraki bakım üç hafta sonra." },
        { id: "a2", start: 630, end: 675, client: "Mert Aydın", service: "İlk muayene", status: "done", note: "Randevuyu WhatsApp onayından sonra aldı." },
        { id: "b1", start: 720, end: 780, client: "Öğle arası", service: "", status: "confirmed", note: "", block: true },
        { id: "a3", start: 870, end: 915, client: "Zeynep Arslan", service: "Saç boyama", status: "confirmed", note: "Yeni müşteri. Numarasını SMS koduyla doğruladı." },
        { id: "a4", start: 960, end: 1020, client: "Burak Şahin", service: "Diyet görüşmesi", status: "pending", note: "Saati onaylamanız bekleniyor." },
      ],
      notifications: [
        { title: "Yeni randevu", body: "Zeynep Arslan · yarın 14:30" },
        { title: "WhatsApp onayı gitti", body: "Elif Karaca · bugün 09:00" },
        { title: "Hatırlatma gönderildi", body: "Burak Şahin · bugün 16:00" },
      ],
      now: "şimdi",
    },
    booking: {
      title: "Müşteriniz üç dokunuşta randevu alır.",
      body: "Hizmeti seçer, boş saate dokunur, adını ve numarasını yazar. Uygulama indirmez. Onay mesajı WhatsApp'tan gelir.",
      demoNote: "Bu bir örnek akış. Girdiğiniz bilgiler kaydedilmez.",
      host: { name: "Ayşe Demir", initials: "AD", role: "Güzellik merkezi · İstanbul" },
      steps: ["Hizmet", "Zaman", "Bilgiler"],
      services: [
        { id: "cilt", name: "Cilt bakımı", duration: 45, where: "Salonda", price: "₺900" },
        { id: "kas", name: "Kaş ve kirpik", duration: 30, where: "Salonda", price: "₺450" },
        { id: "danisma", name: "Ön görüşme", duration: 15, where: "Telefonda", price: "Ücretsiz" },
      ],
      minutes: "dk",
      next: "Devam",
      back: "Geri",
      pickDay: "Bir gün seçin",
      dayFull: "Bu gün dolu. Başka bir gün seçin.",
      nameLabel: "Ad soyad",
      phoneLabel: "Cep telefonu",
      phoneHint: "Onay ve hatırlatma bu numaraya gelir.",
      phoneError: "Geçerli bir numara yazın. Örnek: 0532 123 45 67",
      confirm: "Randevuyu onayla",
      doneTitle: "Randevunuz alındı",
      doneBody: "Onay mesajı WhatsApp'tan gönderildi.",
      doneService: "Hizmet",
      doneTime: "Zaman",
      doneWhere: "Yer",
      again: "Baştan dene",
      change: "Değiştir",
    },
    features: {
      title: "Randevuyla ilgili her şey, tek yerde.",
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
        {
          title: "Hatırlatmalar",
          body: "Randevudan önce müşteriye hatırlatma gider. Gelmeyen müşteri sayısı düşer.",
        },
      ],
    },
    how: {
      title: "Bağlantıdan hatırlatmaya, siz uğraşmadan.",
      waiting: "bekliyor",
      steps: [
        { title: "Saatlerinizi belirleyin", body: "Çalışma günlerinizi, randevu sürelerini ve araları girin.", meta: "Pzt–Cmt · 09:00–19:00" },
        { title: "Bağlantınızı paylaşın", body: "Instagram profilinize, sitenize ya da WhatsApp'a ekleyin.", meta: "rondevu.org/salonunuz" },
        { title: "Müşteri saatini seçer", body: "Yalnız gerçekten boş saatler görünür. Numara SMS koduyla doğrulanır.", meta: "14:30 · 45 dk" },
        { title: "Mesajlar kendiliğinden gider", body: "Onay ve hatırlatma WhatsApp ve SMS ile gönderilir.", meta: "12:30 · gönderildi" },
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
      planNote: "Plan kurulumunu sizinle birlikte yapıyoruz.",
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
      title: "İlk randevunuz bugün gelsin.",
      body: "Sorularınızı WhatsApp'tan yazın, size yardımcı olalım.",
      button: "Bize yazın",
      secondary: "Fiyatları gör",
    },
  },
  en: {
    nav: { product: "Product", how: "How it works", pricing: "Pricing", faq: "FAQ", theme: "Toggle theme" },
    hero: {
      title: "Every minute of the day in its place.",
      subtitle:
        "Share your open hours with a single link. Clients pick their time, and confirmations and reminders go out by WhatsApp and SMS.",
      primary: "Contact us",
      secondary: "How it works",
      ringIdle: "1440 minutes, one ring",
      ringTomorrow: "tomorrow",
      ringFree: "open",
      ringBooked: "booked",
    },
    preview: {
      url: "app.rondevu.org/today",
      caption: "Sample screen, fictional data",
      sidebar: ["Today", "Bookings", "Availability", "Clients", "Settings"],
      today: "Today",
      newBooking: "New booking",
      stats: [
        { label: "Today", sub: "2 completed" },
        { label: "Booked time", sub: "Close to half the day" },
        { label: "Weekly occupancy", sub: "9 points above last week" },
        { label: "WhatsApp confirmations", sub: "Sent this week" },
      ],
      statFormats: { bookings: "bookings", hours: "h", minutes: "min" },
      timeline: "Timeline",
      status: { done: "Arrived", confirmed: "Confirmed", pending: "Awaiting approval" },
      visit: "visit",
      time: "Time",
      duration: "Length",
      minutes: "min",
      confirm: "Confirm",
      reschedule: "Reschedule",
      appointments: [
        { id: "a1", start: 540, end: 570, client: "Elif Karaca", service: "Facial care", status: "done", note: "Sensitive skin. Next treatment in three weeks." },
        { id: "a2", start: 630, end: 675, client: "Mert Aydın", service: "First consultation", status: "done", note: "Booked after the WhatsApp confirmation." },
        { id: "b1", start: 720, end: 780, client: "Lunch break", service: "", status: "confirmed", note: "", block: true },
        { id: "a3", start: 870, end: 915, client: "Zeynep Arslan", service: "Hair coloring", status: "confirmed", note: "New client. Verified the number with an SMS code." },
        { id: "a4", start: 960, end: 1020, client: "Burak Şahin", service: "Diet session", status: "pending", note: "Waiting for you to approve the time." },
      ],
      notifications: [
        { title: "New booking", body: "Zeynep Arslan · tomorrow 14:30" },
        { title: "WhatsApp confirmation sent", body: "Elif Karaca · today 09:00" },
        { title: "Reminder sent", body: "Burak Şahin · today 16:00" },
      ],
      now: "now",
    },
    booking: {
      title: "Clients book in three taps.",
      body: "They pick a service, tap a free slot and enter their name and number. No app to install. The confirmation arrives on WhatsApp.",
      demoNote: "This is a sample flow. Nothing you enter is saved.",
      host: { name: "Ayşe Demir", initials: "AD", role: "Beauty center · Istanbul" },
      steps: ["Service", "Time", "Details"],
      services: [
        { id: "cilt", name: "Facial care", duration: 45, where: "At the salon", price: "₺900" },
        { id: "kas", name: "Brows and lashes", duration: 30, where: "At the salon", price: "₺450" },
        { id: "danisma", name: "Intro call", duration: 15, where: "By phone", price: "Free" },
      ],
      minutes: "min",
      next: "Continue",
      back: "Back",
      pickDay: "Pick a day",
      dayFull: "This day is full. Pick another one.",
      nameLabel: "Full name",
      phoneLabel: "Mobile number",
      phoneHint: "Confirmations and reminders go to this number.",
      phoneError: "Enter a valid number. Example: 0532 123 45 67",
      confirm: "Confirm booking",
      doneTitle: "You're booked",
      doneBody: "The confirmation was sent on WhatsApp.",
      doneService: "Service",
      doneTime: "Time",
      doneWhere: "Place",
      again: "Start over",
      change: "Change",
    },
    features: {
      title: "Everything about bookings, in one place.",
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
        {
          title: "Reminders",
          body: "Clients get a reminder before their appointment. Fewer people miss their slot.",
        },
      ],
    },
    how: {
      title: "From link to reminder, without lifting a finger.",
      waiting: "waiting",
      steps: [
        { title: "Set your hours", body: "Enter your working days, appointment lengths and breaks.", meta: "Mon–Sat · 09:00–19:00" },
        { title: "Share your link", body: "Add it to your Instagram profile, your site or WhatsApp.", meta: "rondevu.org/your-salon" },
        { title: "Clients pick a time", body: "Only truly free slots show. The number is verified with an SMS code.", meta: "14:30 · 45 min" },
        { title: "Messages go out on their own", body: "Confirmations and reminders are sent by WhatsApp and SMS.", meta: "12:30 · sent" },
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
      planNote: "We set up your plan together with you.",
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
      title: "Let your first booking come in today.",
      body: "Write to us on WhatsApp and we will help.",
      button: "Contact us",
      secondary: "See pricing",
    },
  },
};
