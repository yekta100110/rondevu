"use client";

import { designTokens } from "@rondevu/lib/designTokens";
import { homeContent } from "../../home-content";
import type { Locale } from "../../i18n/home-translations";
import OpenSlotBooking, { type OsbBusy, type OsbLabels } from "./BookingStage";

interface HomeHeroProps {
  locale: Locale;
  whatsapp?: string;
}

/** A believable week for the sample salon: lunch, a staff meeting and a few existing appointments. */
const SAMPLE_BUSY: OsbBusy[] = [
  { weekday: 1, from: "13:00", to: "14:00" },
  { weekday: 2, from: "10:00", to: "11:30" },
  { weekday: 2, from: "13:00", to: "14:00" },
  { weekday: 3, from: "13:00", to: "14:00" },
  { weekday: 3, from: "15:30", to: "17:00" },
  { weekday: 4, from: "11:00", to: "12:00" },
  { weekday: 4, from: "13:00", to: "14:00" },
  { weekday: 5, from: "09:30", to: "11:00" },
  { weekday: 5, from: "13:00", to: "14:00" },
  { weekday: 6, from: "12:00", to: "13:00" },
];

const STAGE_COLORS = {
  slab: designTokens.accent.coral,
  from: designTokens.accent.coral,
  to: designTokens.accent.coral,
  fromDark: designTokens.accent.coralOnDark,
  toDark: designTokens.accent.coralOnDark,
  action: designTokens.brand.dark,
  window: designTokens.surface.darkBase,
} as const;

export function HomeHero({ locale, whatsapp }: HomeHeroProps) {
  const { hero } = homeContent[locale];
  const stage = hero.stage;
  const waDigits = (whatsapp ?? "").replace(/\D/g, "");

  return (
    <section className="relative overflow-hidden bg-default px-4 pt-12 sm:px-6 lg:px-8">
      <OpenSlotBooking
        headline={hero.title}
        headlineAccent={hero.titleAccent}
        description={hero.subtitle}
        altContact={waDigits ? { label: hero.altContact, href: `https://wa.me/${waDigits}` } : null}
        host={{
          name: stage.host.name,
          role: stage.host.role,
          initials: stage.host.initials,
          stamp: stage.host.stamp,
          city: stage.host.city,
        }}
        meetingTitle={stage.meetingTitle}
        agenda={stage.agenda}
        location={stage.location}
        responseNote={stage.responseNote}
        bookingUrl={stage.bookingUrl}
        durations={[30, 45, 60]}
        defaultDuration={30}
        step={30}
        hostTimeZone="Europe/Istanbul"
        timeZones={["Europe/Istanbul"]}
        hours={{ days: [1, 2, 3, 4, 5, 6], from: "09:00", to: "19:00" }}
        noticeHours={2}
        weeksAhead={4}
        weekStartsOn={1}
        clock="24h"
        hostBusy={SAMPLE_BUSY}
        labels={stage.labels as Partial<OsbLabels>}
        colors={STAGE_COLORS}
        locale={locale === "tr" ? "tr-TR" : "en-GB"}
        className="bg-transparent!"
        fontFamily="var(--font-sans), Inter, system-ui, sans-serif"
        height="auto"
        gridHeight={420}
        onBook={() => new Promise<void>((resolve) => setTimeout(resolve, 700))}
      />
      <p className="mx-auto max-w-[1120px] pb-12 pt-6 text-center text-xs text-muted">{hero.demoNote}</p>
    </section>
  );
}
