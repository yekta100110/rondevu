const fs = require("node:fs");
const path = require("node:path");
const { parse } = require("node-html-parser");
const parse5 = require("parse5");

const publicDir = path.join(__dirname, "..", "apps", "web", "public", "cal_files");

function removeNodes(html, selectors) {
  const root = parse(html, { comment: true });
  const ranges = selectors
    .flatMap((selector) => root.querySelectorAll(selector))
    .map((node) => node.range)
    .filter(Boolean)
    .sort((left, right) => right[0] - left[0]);

  return ranges.reduce((result, [start, end]) => `${result.slice(0, start)}${result.slice(end)}`, html);
}

function replaceNode(html, selector, transform) {
  const node = parse(html, { comment: true }).querySelector(selector);
  if (!node?.range) return html;

  const [start, end] = node.range;
  return `${html.slice(0, start)}${transform(html.slice(start, end))}${html.slice(end)}`;
}

function removeNodesByText(html, selector, pattern) {
  const root = parse(html, { comment: true });
  const ranges = root
    .querySelectorAll(selector)
    .filter((node) => pattern.test(node.text.trim()))
    .map((node) => node.range)
    .filter(Boolean)
    .sort((left, right) => right[0] - left[0]);

  return ranges.reduce((result, [start, end]) => `${result.slice(0, start)}${result.slice(end)}`, html);
}

function normalizeFaqActions(html) {
  const root = parse(html, { comment: true });
  root.querySelectorAll('[data-framer-name="FAQ Section"]').forEach((section) => {
    const actions = section.querySelector('[data-framer-name="Button Wrapper"]');
    const firstQuestion = section.querySelector('[data-framer-name="Question 1"]');
    const questionContainer = firstQuestion?.parentNode?.parentNode?.parentNode;
    if (actions && questionContainer && actions.parentNode !== questionContainer) {
      questionContainer.appendChild(actions);
    }
  });
  return root.toString();
}

function normalizeFaqIcons(html) {
  const root = parse(html, { comment: true });
  root.querySelectorAll('[data-framer-name="FAQ Section"]').forEach((section) => {
    section.querySelectorAll('[data-framer-name="Icon Wrapper"]').forEach((wrapper) => {
      wrapper.setAttribute("style", "background:transparent!important;border:0!important;box-shadow:none!important");
    });
    section.querySelectorAll('[data-framer-name="Plus, add small"]').forEach((plus) => {
      plus.set_content("+");
      plus.setAttribute(
        "style",
        "align-items:center!important;background:transparent!important;color:#f4f4f5!important;display:flex!important;font-family:Arial,sans-serif!important;font-size:22px!important;font-weight:300!important;justify-content:center!important;line-height:1!important"
      );
    });
  });
  return root.toString();
}

function normalizeStatusWrappers(html, locale) {
  const root = parse(html, { comment: true });
  const label = locale === "tr" ? "Tüm Sistemler Aktif" : "All Systems Operational";
  root.querySelectorAll('[data-framer-name="Status Wrapper"]').forEach((status) => {
    status.classList.add("rondevu-status-link");
    status.setAttribute("title", label);
    status.set_content(
      `<span class="rondevu-status-dot" aria-hidden="true"></span><span class="rondevu-status-label">${label}</span>`
    );
  });
  return root.toString();
}

function finalizeHome(filename, locale) {
  const filePath = path.join(publicDir, filename);
  let html = fs.readFileSync(filePath, "utf8");
  const root = parse(html, { comment: true });
  const googleButton = root
    .querySelectorAll('[data-framer-name="Hero Section"] a')
    .find((node) => /Google ile Başla|Sign up with Google/.test(node.text));
  const googleVariant = googleButton?.closest(".ssr-variant");

  if (googleVariant?.range) {
    const [start, end] = googleVariant.range;
    html = `${html.slice(0, start)}${html.slice(end)}`;
  }

  html = removeNodes(html, [".framer-1rc0l08", ".framer-2b9066", ".framer-17g5vjo", ".framer-Ylq1r"]);
  html = removeNodesByText(html, "a", /^(Nasıl Çalışır\?|How it works)$/i);
  html = removeNodes(html, ['[data-framer-name="Logo Wrapper"] img[src*="rondevu-icon"]']);
  html = normalizeFaqActions(html);
  html = normalizeFaqIcons(html);
  html = normalizeStatusWrappers(html, locale);
  html = html.replace(/2025/g, "2026");

  html = replaceNode(html, ".framer-4x0iks-container a", (anchor) =>
    anchor
      .replace(
        locale === "tr" ? "E-posta ile Başla" : "Sign up with email",
        locale === "tr" ? "Hemen Başla" : "Get Started"
      )
      .replace(/\s+target="_blank"/, "")
  );

  fs.writeFileSync(filePath, html, "utf8");
}

const removedPricingRows = [
  "framer-zy7pxt",
  "framer-1m4lkvf",
  "framer-k782di",
  "framer-1wtdl09",
  "framer-15t5jbj",
  "framer-10e89zu",
  "framer-tfa9uv",
  "framer-3jyhz3",
  "framer-w3np8o",
  "framer-mbtjyy",
  "framer-60e06u",
  "framer-1g3jnj4",
  "framer-2t5sem",
  "framer-m8gvh8",
  "framer-nvnqo",
  "framer-p9lsqr",
  "framer-1jt8d1p",
  "framer-l4xoif",
  "framer-zf29pt",
];

function normalizePlanTriggers(html) {
  const root = parse(html, { comment: true });
  const triggers = root
    .querySelectorAll("[data-plan]")
    .map((node) => ({
      range: node.range,
      plan: node.getAttribute("data-plan"),
      isPrimary: node.getAttribute("data-framer-name") === "Primary",
    }))
    .filter(({ range }) => range)
    .sort((left, right) => right.range[0] - left.range[0]);

  return triggers.reduce((result, trigger) => {
    const [start, end] = trigger.range;
    const segment = result.slice(start, end);
    const closingBracket = segment.indexOf(">");
    let openingTag = segment.slice(0, closingBracket);

    openingTag = openingTag
      .replace(/\s+data-plan="(?:monthly|yearly)"/g, "")
      .replace(/\s+data-plan-btn="true"/g, "")
      .replace(/\s+target="_blank"/g, "");

    if (trigger.isPrimary && (trigger.plan === "monthly" || trigger.plan === "yearly")) {
      openingTag = openingTag.replace(/^<a/, `<a data-plan="${trigger.plan}" data-plan-btn="true"`);
    }

    const replacement = `${openingTag}${segment.slice(closingBracket)}`;
    return `${result.slice(0, start)}${replacement}${result.slice(end)}`;
  }, html);
}

function normalizeFeatureChecks(html, locale) {
  const root = parse(html, { comment: true });
  root.querySelectorAll('[data-framer-name="Row"]').forEach((row) => {
    const children = row.childNodes.filter((node) => node.nodeType === 1);
    const featureText =
      children[0]?.getAttribute?.('data-framer-name') === "Feature Text Wrapper"
        ? children[0]
        : children[0]?.querySelector?.('[data-framer-name="Feature Text Wrapper"]');
    const richTextCount = featureText?.querySelectorAll('[data-framer-component-type="RichTextContainer"]').length ?? 0;
    const cells = children.slice(1);
    if (richTextCount < 2 || cells.length !== 2) return;

    const checkLabel = locale === "tr" ? "Dahil" : "Included";
    cells.forEach((cell) => {
      cell.set_content(`<span class="rondevu-feature-check" aria-label="${checkLabel}">✓</span>`);
    });
  });
  return root.toString();
}

function normalizeComparisonPlanHeader(html, locale) {
  const root = parse(html, { comment: true });
  const annual = root.querySelector(
    '#feature-breakdown [data-framer-name="Top Wrapper Transparant"].framer-o086nb'
  );
  if (!annual) return html;

  annual.querySelector('.framer-6413sp')?.remove();
  annual.querySelector('.framer-198hpn4')?.remove();

  const description = annual.querySelector('[data-framer-name="Text Wrapper"] .framer-eyiwq4 p');
  if (description) {
    description.set_content(locale === "tr" ? "En popüler yıllık paket." : "Most popular annual plan.");
  }

  return root.toString();
}

function normalizeYearlyCardLabels(html) {
  const root = parse(html, { comment: true });
  const yearlyCard = root.querySelector('[data-framer-name="Pricing Card"].framer-6fxrby');
  if (!yearlyCard) return html;

  yearlyCard.querySelectorAll('[data-framer-name="Discount Wrapper"]').forEach((node) => node.remove());
  yearlyCard.querySelectorAll('[data-framer-name="Yearly Light"]').forEach((node) => node.remove());
  yearlyCard
    .querySelectorAll('p')
    .filter((node) => /^(?:2 Ay Hediye \(%20 Avantaj\)|2 Months Free \(20% Off\)|Yıllık faturalandırılır|Billed yearly|Billed annually)$/i.test(node.text.trim()))
    .forEach((node) => node.remove());

  return root.toString();
}

function normalizeFeatureSectionDivider(html, locale) {
  const root = parse(html, { comment: true });
  const label = locale === "tr" ? "Gelişmiş randevu özellikleri" : "Advanced features";

  root.querySelectorAll('[data-framer-name="Row"]').forEach((row) => {
    if (row.text.trim() !== label) return;
    row.classList.add("rondevu-feature-section-divider");
  });

  return root.toString();
}

function normalizePricingFooter(html) {
  const root = parse(html, { comment: true });

  root.querySelectorAll('[data-framer-name="Status Wrapper"]').forEach((status) => {
    status.parentNode?.remove();
  });

  root.querySelectorAll('.framer-pricing-footer-container').forEach((footer) => {
    footer.classList.add("rondevu-pricing-footer");
    footer.querySelector('[data-framer-name="Company Info Wrapper"]')?.classList.add(
      "rondevu-pricing-footer-info"
    );
    footer.querySelector('[data-framer-name="Logo Wrapper"]')?.classList.add("rondevu-pricing-footer-logo");
    footer.querySelector('.framer-1cjzev6')?.classList.add("rondevu-pricing-footer-copyright");
  });

  return root.toString();
}

function normalizePricingFeatureLinks(html) {
  const featureLabels =
    "Özel Rezervasyon Bağlantısı|Mola ve Tampon Süre Yönetimi|Custom Booking Links|Buffer Time &amp; Availability Management";
  const linkedFeature = new RegExp(
    `<!--\\$--><a\\b[^>]*href=["']\\./app["'][^>]*>(${featureLabels})</a><!--\\/\\$-->`,
    "g"
  );

  const root = parse(html.replace(linkedFeature, "$1"), { comment: true });
  const labels = /^(?:Özel Rezervasyon Bağlantısı|Mola ve Tampon Süre Yönetimi|Custom Booking Links|Buffer Time & Availability Management)$/;

  root.querySelectorAll('[data-framer-name="Pricing Card"] p').forEach((paragraph) => {
    if (!labels.test(paragraph.text.trim())) return;

    const style = paragraph.getAttribute("style");
    if (!style) return;

    paragraph.setAttribute(
      "style",
      style.replace(/--framer-text-decoration(?:-[^:;]+)?:[^;]+;?/g, "")
    );
  });

  return root.toString();
}

function finalizePricing(filename, locale) {
  const filePath = path.join(publicDir, filename);
  let html = fs.readFileSync(filePath, "utf8");

  html = removeNodes(
    html,
    removedPricingRows.map((className) => `.${className}`)
  );

  html = html.replace(/\s+hidden-1hydjgn/g, "").replace(/\s+hidden-wcozae/g, "");

  if (locale === "tr") {
    html = html
      .replace(/İhtiyacınıza Uygun Esnek Planlar/g, "rOndevu planınızı seçin")
      .replace(/Bireysel ve büyüyen işletmeler için\./g, "Bireysel kullanım için tüm randevu özellikleri.")
      .replace(
        /Bireysel kullanıcılar ve büyüyen ekipler için\./g,
        "Bireysel kullanım için tüm randevu özellikleri."
      )
      .replace(/Google, Outlook & Apple Takvim Eşitleme/g, "Google Takvim Bağlantısı ve Apple .ics")
      .replace(/Kurumsal Takvim Entegrasyonları/g, "Apple Calendar (.ics) Aktarımı")
      .replace(/kurumsal profilinizi/g, "kişisel profilinizi")
      .replace(/Sınırsız takvim bağlantısı/g, "Google Takvim bağlantısı")
      .replace(
        /Müsaitliği eşitlemek ve çifte randevuları önlemek için birden fazla takvim bağlayın\./g,
        "Google Takvim bağlantısıyla müsaitliklerinizi kontrol edin ve yeni randevuları takviminize aktarın."
      )
      .replace(/Google, Outlook, Apple, Zoho Takvim eşitlemesi/g, "Apple Calendar (.ics) aktarımı")
      .replace(
        /Tüm bağlı takvimlerinizdeki müsait saatleri ve randevuları anlık olarak senkronize edin\./g,
        "Onaylanan randevuları Apple Calendar'a eklemek için standart .ics dosyasını kullanın."
      );
  } else {
    html = html
      .replace(/Flexible Plans for Your Scheduling Needs/g, "Choose your rOndevu plan")
      .replace(/For individuals & small growing teams\./g, "All appointment features for individual use.")
      .replace(/For individuals and growing teams\./g, "All appointment features for individual use.")
      .replace(/Google, Outlook & Apple Calendar Sync/g, "Google Calendar Connection & Apple .ics")
      .replace(/Enterprise Calendar Integration/g, "Apple Calendar (.ics) Export")
      .replace(/Routing Forms/g, "Custom Booking Questions")
      .replace(/team workload/g, "appointment volume")
      .replace(/Unlimited calendar connections/g, "Google Calendar connection")
      .replace(
        /Connect multiple calendars to sync availability and prevent double bookings\./g,
        "Use Google Calendar to check availability and export new appointments to your calendar."
      )
      .replace(
        /Google Calendar, Outlook, Apple Calendar, Zoho Calendar \+ more/g,
        "Apple Calendar (.ics) export"
      )
      .replace(
        /Sync availability and events across all your connected calendars in real time\./g,
        "Use the standard .ics file to add confirmed appointments to Apple Calendar."
      );
  }

  html = normalizeFeatureChecks(html, locale);
  html = normalizeComparisonPlanHeader(html, locale);
  html = normalizeYearlyCardLabels(html);
  html = normalizeFeatureSectionDivider(html, locale);
  html = normalizePricingFeatureLinks(html);
  html = normalizePlanTriggers(html);
  html = removeNodes(html, ['[data-framer-name="Logo Wrapper"] img[src*="rondevu-icon"]']);
  html = normalizePricingFooter(html);
  html = parse5.serialize(parse5.parseFragment(html));
  fs.writeFileSync(filePath, html, "utf8");
}

finalizeHome("cal-dom-tr.html", "tr");
finalizeHome("cal-dom-en.html", "en");
finalizePricing("pricing-dom-tr.html", "tr");
finalizePricing("pricing-dom-en.html", "en");

console.log("Marketing page fragments finalized.");
