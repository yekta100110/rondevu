const fs = require("node:fs");
const path = require("node:path");
const process = require("node:process");
const { parse } = require("node-html-parser");

const publicDir = path.join(__dirname, "..", "apps", "web", "public", "cal_files");
const files = {
  homeTr: fs.readFileSync(path.join(publicDir, "cal-dom-tr.html"), "utf8"),
  homeEn: fs.readFileSync(path.join(publicDir, "cal-dom-en.html"), "utf8"),
  pricingTr: fs.readFileSync(path.join(publicDir, "pricing-dom-tr.html"), "utf8"),
  pricingEn: fs.readFileSync(path.join(publicDir, "pricing-dom-en.html"), "utf8"),
};

const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

expect(
  !/Google ile Başla|E-posta ile Başla|Kredi kartı gerekmez|rOndevu yayında/.test(files.homeTr),
  "TR hero cleanup failed"
);
expect(
  !/Sign up with Google|Sign up with email|No credit card required|rOndevu launches/.test(files.homeEn),
  "EN hero cleanup failed"
);
const renderedHomeTrText = parse(files.homeTr, { comment: true })
  .querySelectorAll("h1,h2,h3,p,a")
  .map((node) => node.text)
  .join(" ");
const renderedHomeEnText = parse(files.homeEn, { comment: true })
  .querySelectorAll("h1,h2,h3,p,a")
  .map((node) => node.text)
  .join(" ");
expect(
  !/Kullanıcılarımızın rOndevu|Mutlu Danışanlar/.test(renderedHomeTrText),
  "TR social proof cleanup failed"
);
expect(
  !/Don.t just take our word for it|Testimonials/.test(renderedHomeEnText),
  "EN social proof cleanup failed"
);
expect(!/altyap[ıi]/i.test(`${files.homeTr}${files.pricingTr}`), "Forbidden Turkish copy found");

const removedTerms =
  /Randevu devretme|Ortak çalışma takvimi|Kriter bazlı yönlendirme|Ekip üyesi özellikleri|SAML|SCIM|Salesforce|HubSpot|100'den Fazla|Transfer a scheduled|Shared team|Attribute based routing|teammates|Single Sign-On|dedicated database|100\+ other/i;
expect(!removedTerms.test(`${files.pricingTr}${files.pricingEn}`), "Unsupported pricing feature found");

for (const [name, html] of Object.entries({ pricingTr: files.pricingTr, pricingEn: files.pricingEn })) {
  const root = parse(html, { comment: true });
  const triggers = root.querySelectorAll("[data-plan]");
  expect(triggers.length === 4, `${name} should contain four plan CTAs`);
  expect(
    triggers.every((node) => node.getAttribute("data-framer-name") === "Primary"),
    `${name} has a non-CTA plan trigger`
  );
  expect((html.match(/data-plan="monthly"/g) || []).length === 2, `${name} monthly CTA count is invalid`);
  expect((html.match(/data-plan="yearly"/g) || []).length === 2, `${name} yearly CTA count is invalid`);
  expect(
    !/data-plan="(?:monthly|yearly)"[^>]*data-plan="/.test(html),
    `${name} has duplicate plan attributes`
  );
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL: ${failure}`);
  }
  process.exit(1);
}

console.log("Marketing page static verification passed.");
