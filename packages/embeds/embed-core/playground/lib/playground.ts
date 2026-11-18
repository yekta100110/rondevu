import type { EmbedEvent, GlobalCal } from "../../src/embed";

const Rondevu = window.Rondevu as GlobalCal;
Rondevu.config = Rondevu.config || {};
Rondevu.config.forwardQueryParams = true;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const callback = (e: any) => {
  const detail = e.detail;
};

// @ts-expect-error  window.rondevuOrigin is set in index.html
const origin = `${new URL(document.URL).protocol}//${window.rondevuOrigin.split("//")[1]}`;
document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if ("href" in target && typeof target.href === "string") {
    const toUrl = new URL(target.href);
    const pageUrl = new URL(document.URL);
    for (const [name, value] of pageUrl.searchParams.entries()) {
      if (toUrl.searchParams.get(name) === null) {
        toUrl.searchParams.append(decodeURIComponent(name), value);
      }
    }
    location.href = `?${toUrl.searchParams.toString()}#${toUrl.hash}`;
    e.preventDefault();
  }
});

const searchParams = new URL(document.URL).searchParams;
const only = searchParams.get("only");
const colorScheme = searchParams.get("color-scheme");
const prerender = searchParams.get("prerender");

if (colorScheme) {
  document.documentElement.style.colorScheme = colorScheme;
}
const themeInParam = searchParams.get("theme");
const validThemes = ["light", "dark", "auto"] as const;
const theme = validThemes.includes((themeInParam as (typeof validThemes)[number]) || "")
  ? (themeInParam as (typeof validThemes)[number])
  : null;
if (themeInParam && !theme) {
  throw new Error(`Invalid theme: ${themeInParam}`);
}

const rondevuLink = searchParams.get("rondevu-link");

function fakeEvent({ namespace, eventType, data }) {
  window.postMessage({
    fullType: `CAL:${namespace}:${eventType}`,
    namespace,
    originator: "CAL",
    type: eventType,
    data,
  });
}

window.heavilyCustomizeUi = ({ namespace }) => {
  Rondevu.ns[namespace]("ui", {
    theme: "light",
    cssVarsPerTheme: {
      light: {
        "rondevu-brand": "#6F61C0",
        "rondevu-text": "#6F61C0",
        "rondevu-text-emphasis": "#4D408D",
        "rondevu-border-emphasis": "#4D408D",
        "rondevu-text-error": "pink",
        "rondevu-border": "#A090E0",
        "rondevu-border-default": "#A090E0",
        "rondevu-border-subtle": "#A090E0",
        "rondevu-border-booker": "red",
        "rondevu-text-muted": "#C0B8FF",
        "rondevu-bg-emphasis": "#E1DFFF",
        "rondevu-border-booker-width": "3px",
        "rondevu-radius": "1px",
        "rondevu-radius-md": "2px",
        "rondevu-radius-lg": "3px",
        "rondevu-radius-xl": "4px",
        "rondevu-radius-2xl": "5px",
        "rondevu-radius-3xl": "6px",
        "rondevu-radius-full": "7px",
        "rondevu-spacing-px": "5px",
        // More CSS variables are defined here
        // https://github.com/yekta100110/rOndevu/blob/main/packages/config/tailwind-preset.js
      },
      dark: {
        // Set the similar variables as in light theme but for dark mode.
      },
    },
  });
};

window.fakeErrorScenario = ({ namespace }) => {
  fakeEvent({
    namespace,
    eventType: "linkFailed",
    data: { code: 500 },
  });
};

if (only === "all" || only === "ns:default") {
  Rondevu("init", {
    debug: true,
    rondevuOrigin: origin,
  });

  Rondevu("inline", {
    elementOrSelector: "#rondevu-booking-place-default .place",
    rondevuLink: "pro?case=1",
    config: {
      iframeAttrs: {
        id: "rondevu-booking-place-default-iframe",
      },
      name: "John",
      email: "johndoe@gmail.com",
      guests: ["janedoe@example.com", "test@example.com"],
      theme: "dark",
      "flag.coep": "true",
    },
  });
  Rondevu("on", {
    action: "*",
    callback,
  });
}
if (only === "all" || only === "ns:second") {
  // Create a namespace "second". It can be accessed as Rondevu.ns.second with the exact same API as Rondevu
  Rondevu("init", "second", {
    debug: true,
    origin: origin,
  });

  Rondevu.ns.second(
    "inline",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    {
      elementOrSelector: "#rondevu-booking-place-second .place",
      rondevuLink: "pro?case=2",
      config: {
        iframeAttrs: {
          id: "rondevu-booking-place-second-iframe",
        },
        theme: "auto",
        "flag.coep": "true",
      },
    }
  );
  Rondevu.ns.second("on", {
    action: "*",
    callback,
  });
}
if (only === "all" || only === "ns:third") {
  // Create a namespace "third". It can be accessed as Rondevu.ns.second with the exact same API as Rondevu
  Rondevu("init", "third", {
    debug: true,
    origin: origin,
  });

  Rondevu.ns.third(
    [
      "inline",
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      {
        elementOrSelector: "#rondevu-booking-place-third .place",
        rondevuLink: "pro/30min",
        config: {
          iframeAttrs: {
            id: "rondevu-booking-place-third-iframe",
          },
          "flag.coep": "true",
        },
      },
    ],
    [
      "ui",
      {
        styles: {
          body: {
            background: "transparent",
          },
          branding: {
            brandColor: "#81e61c",
            lightColor: "#494545",
            lighterColor: "#4c4848",
            lightestColor: "#7c7777",
            highlightColor: "#9b0e0e",
            medianColor: "black",
          },
          enabledDateButton: {
            backgroundColor: "red",
          },
          disabledDateButton: {
            backgroundColor: "green",
          },
        },
      },
    ]
  );
  Rondevu.ns.third("on", {
    action: "*",
    callback,
  });
}
if (only === "all" || only === "ns:fourth") {
  Rondevu("init", "fourth", {
    debug: true,
    origin: origin,
  });
  Rondevu.ns.fourth(
    [
      "inline",
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      {
        elementOrSelector: "#rondevu-booking-place-fourth .place",
        rondevuLink: "team/seeded-team",
        config: {
          iframeAttrs: {
            id: "rondevu-booking-place-fourth-iframe",
          },
          "flag.coep": "true",
        },
      },
    ],
    [
      "ui",
      {
        styles: {
          body: {
            background: "transparent",
          },
          branding: {
            brandColor: "#81e61c",
            lightColor: "#494545",
            lighterColor: "#4c4848",
            lightestColor: "#7c7777",
            highlightColor: "#9b0e0e",
            medianColor: "black",
          },
        },
      },
    ]
  );
  Rondevu.ns.fourth("on", {
    action: "*",
    callback,
  });
}

if (only === "all" || only === "ns:corpTest") {
  Rondevu("init", "corpTest", {
    debug: true,
    origin: "http://localhost:3000",
  });
  Rondevu.ns.corpTest([
    "inline",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    {
      elementOrSelector: "#rondevu-booking-place-corpTest .place",
      rondevuLink: "pro",
      config: {
        iframeAttrs: {
          id: "rondevu-booking-place-corpTest-iframe",
        },
        "flag.coep": "false",
      },
    },
  ]);
}
if (only === "all" || only === "ns:fifth") {
  Rondevu("init", "fifth", {
    debug: true,
    origin: origin,
  });
  Rondevu.ns.fifth([
    "inline",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    {
      elementOrSelector: "#rondevu-booking-place-fifth .place",
      rondevuLink: "team/seeded-team/collective-seeded-team-event",
      config: {
        iframeAttrs: {
          id: "rondevu-booking-place-fifth-iframe",
        },
        "flag.coep": "true",
      },
    },
  ]);
  Rondevu.ns.fifth("on", {
    action: "*",
    callback,
  });
}

if (only === "all" || only === "prerender-test") {
  Rondevu("init", "e2ePrerenderLightTheme", {
    debug: true,
    origin: origin,
  });
  Rondevu.ns.e2ePrerenderLightTheme("prerender", {
    rondevuLink: "free/30min?flag.coep=true",
    type: "modal",
  });
}

if (only === "all" || only === "preload-test") {
  Rondevu("init", "preloadTest", {
    debug: true,
    origin: origin,
  });
  Rondevu.ns.preloadTest("preload", {
    rondevuLink: "free/30min",
  });
}

if (only === "all" || only === "ns:hideEventTypeDetails") {
  const identifier = "hideEventTypeDetails";
  Rondevu("init", identifier, {
    debug: true,
    origin: origin,
  });

  Rondevu.ns.hideEventTypeDetails(
    [
      "inline",
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      {
        elementOrSelector: `#rondevu-booking-place-${identifier} .place`,
        rondevuLink: "free/30min",
        config: {
          iframeAttrs: {
            id: `rondevu-booking-place-${identifier}-iframe`,
          },
          "flag.coep": "true",
        },
      },
    ],
    [
      "ui",
      {
        hideEventTypeDetails: true,
      },
    ]
  );
}

if (only === "conflicting-theme") {
  Rondevu("init", "conflictingTheme", {
    debug: true,
    origin: origin,
  });

  Rondevu.ns.conflictingTheme("inline", {
    elementOrSelector: "#rondevu-booking-place-conflicting-theme .dark",
    rondevuLink: "pro/30min",
    config: {
      theme: "dark",
    },
  });
  Rondevu.ns.conflictingTheme("inline", {
    elementOrSelector: "#rondevu-booking-place-conflicting-theme .light",
    rondevuLink: "pro/30min",
    config: {
      theme: "light",
    },
  });
}

Rondevu("init", "popupDarkTheme", {
  debug: true,
  origin: origin,
});

Rondevu("init", "e2ePopupLightTheme", {
  debug: true,
  origin: origin,
});

Rondevu("init", "popupHideEventTypeDetails", {
  debug: true,
  origin: origin,
});

Rondevu.ns.popupHideEventTypeDetails("ui", {
  hideEventTypeDetails: true,
});

Rondevu("init", "popupRescheduleWithReschedulePath", {
  debug: true,
  origin: origin,
});

Rondevu("init", "popupRescheduleWithRescheduleUidParam", {
  debug: true,
  origin: origin,
});

Rondevu("init", "popupCancelBooking", {
  debug: true,
  origin: origin,
});

Rondevu("init", "popupAutoTheme", {
  debug: true,
  origin: origin,
});

Rondevu("init", "popupTeamLinkLightTheme", {
  debug: true,
  origin: origin,
});

Rondevu("init", "popupTeamLinkDarkTheme", {
  debug: true,
  origin: origin,
});

Rondevu("init", "popupTeamLinkDarkTheme", {
  debug: true,
  origin: origin,
});

Rondevu("init", "popupTeamLinksList", {
  debug: true,
  origin: origin,
});

Rondevu("init", "popupPaidEvent", {
  debug: true,
  origin: origin,
});

Rondevu("init", "childElementTarget", {
  debug: true,
  origin: origin,
});

Rondevu("init", "floatingButton", {
  debug: true,
  origin: origin,
});

if (only === "all" || only == "ns:floatingButton") {
  if (prerender == "true") {
    Rondevu.ns.floatingButton("prerender", {
      rondevuLink: rondevuLink || "pro",
      type: "floatingButton",
    });
  }
  Rondevu.ns.floatingButton("floatingButton", {
    rondevuLink: rondevuLink || "pro",
    config: {
      iframeAttrs: {
        id: "floatingtest",
      },
      "flag.coep": "true",
      name: "John",
      email: "johndoe@gmail.com",
      guests: ["janedoe@example.com", "test@example.com"],
      ...(theme ? { theme } : {}),
    },
  });
}

if (only === "all" || only == "ns:monthView") {
  // Create a namespace "second". It can be accessed as Rondevu.ns.second with the exact same API as Rondevu
  Rondevu("init", "monthView", {
    debug: true,
    origin: origin,
  });

  Rondevu.ns.monthView(
    "inline",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    {
      elementOrSelector: "#rondevu-booking-place-monthView .place",
      rondevuLink: "free/30min",
      config: {
        iframeAttrs: {
          id: "rondevu-booking-place-monthView-iframe",
        },
        "flag.coep": "true",
        layout: "month_view",
      },
    }
  );
}

if (only === "all" || only == "ns:weekView") {
  // Create a namespace "second". It can be accessed as Rondevu.ns.second with the exact same API as Rondevu
  Rondevu("init", "weekView", {
    debug: true,
    origin: origin,
  });

  Rondevu.ns.weekView(
    "inline",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    {
      elementOrSelector: "#rondevu-booking-place-weekView .place",
      rondevuLink: "free/30min",
      config: {
        iframeAttrs: {
          id: "rondevu-booking-place-weekView-iframe",
        },
        "flag.coep": "true",
        layout: "week_view",
      },
    }
  );
  Rondevu.ns.weekView("on", {
    action: "*",
    callback,
  });
}

if (only === "all" || only == "ns:columnView") {
  // Create a namespace "second". It can be accessed as Rondevu.ns.second with the exact same API as Rondevu
  Rondevu("init", "columnView", {
    debug: true,
    origin: origin,
  });

  Rondevu.ns.columnView(
    "inline",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    {
      elementOrSelector: "#rondevu-booking-place-columnView .place",
      rondevuLink: "free/30min",
      config: {
        iframeAttrs: {
          id: "rondevu-booking-place-columnView-iframe",
        },
        "flag.coep": "true",
        layout: "column_view",
      },
    }
  );

  Rondevu.ns.columnView("on", {
    action: "*",
    callback,
  });
}

if (only === "all" || only == "ns:twoStepSlotSelection") {
  Rondevu("init", "twoStepSlotSelection", {
    debug: true,
    origin: origin,
  });

  Rondevu.ns.twoStepSlotSelection(
    "inline",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    {
      elementOrSelector: "#rondevu-booking-place-twoStepSlotSelection .place",
      rondevuLink: "free/30min",
      config: {
        iframeAttrs: {
          id: "rondevu-booking-place-twoStepSlotSelection-iframe",
        },
        "flag.coep": "true",
        name: "John",
        email: "john@booker.com",
        notes: ["test"],
        guests: ["guest@example.com"],
        useSlotsViewOnSmallScreen: "true",
      },
    }
  );

  Rondevu.ns.twoStepSlotSelection("on", {
    action: "*",
    callback,
  });
}

if (only === "all" || only == "ns:columnViewHideEventTypeDetails") {
  // Create a namespace "second". It can be accessed as Rondevu.ns.second with the exact same API as Rondevu
  Rondevu("init", "columnViewHideEventTypeDetails", {
    debug: true,
    origin: origin,
  });

  Rondevu.ns.columnViewHideEventTypeDetails(
    "inline",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    {
      elementOrSelector: "#rondevu-booking-place-columnViewHideEventTypeDetails .place",
      rondevuLink: "free/30min",
      config: {
        iframeAttrs: {
          id: "rondevu-booking-place-columnView-iframe",
        },
        "flag.coep": "true",
        layout: "column_view",
      },
    }
  );

  Rondevu.ns.columnViewHideEventTypeDetails("ui", {
    hideEventTypeDetails: true,
  });

  Rondevu.ns.columnViewHideEventTypeDetails("on", {
    action: "*",
    callback,
  });
}

if (only === "all" || only == "ns:autoScrollTest") {
  if (!rondevuLink) {
    throw new Error("rondevu-link parameter is required for autoScrollTest");
  }
  Rondevu("init", "autoScrollTest", {
    debug: true,
    origin: origin,
  });
  Rondevu.ns.autoScrollTest("inline", {
    elementOrSelector: "#rondevu-booking-place-autoScrollTest .place",
    rondevuLink: rondevuLink,
    config: {
      "flag.coep": "true",
    },
  });
}

if (only === "all" || only == "ns:pageParamsForwarding") {
  Rondevu("init", "pageParamsForwarding", {
    debug: true,
    origin: origin,
  });

  Rondevu.ns.pageParamsForwarding("inline", {
    elementOrSelector: "#rondevu-booking-place-pageParamsForwarding .place",
    rondevuLink: "pro/paid?embedType=inline&month=2024-08&date=2024-08-26&slot=2024-08-26T14%3A00%3A00.000Z",
    config: {
      iframeAttrs: {
        id: "rondevu-booking-place-pageParamsForwarding-iframe",
      },
      "flag.coep": "true",
    },
  });
}

// Verifies that the type of e.detail.data is valid. type-check will fail if we accidentally break it.
const bookingSuccessfulV2Callback = (e: EmbedEvent<"bookingSuccessfulV2">) => {
  const data = e.detail.data;
  console.log("bookingSuccessfulV2", {
    endTime: data.endTime,
    startTime: data.startTime,
    title: data.title,
  });

  // Remove the event listener after it is fired once
  Rondevu("off", {
    action: "bookingSuccessfulV2",
    callback: bookingSuccessfulV2Callback,
  });
};

Rondevu("on", {
  action: "bookingSuccessfulV2",
  callback: bookingSuccessfulV2Callback,
});

const bookerReadyCallback = (e: EmbedEvent<"bookerReady">) => {
  const data = e.detail.data;
  console.log("bookerReady", {
    eventId: data.eventId,
    eventSlug: data.eventSlug,
  });

  Rondevu("off", {
    action: "bookerReady",
    callback: bookerReadyCallback,
  });
};

Rondevu("on", {
  action: "bookerReady",
  callback: bookerReadyCallback,
});

if (only === "all" || only === "ns:skeletonDemo") {
  Rondevu("init", "skeletonDemo", {
    debug: true,
    origin: origin,
  });

  // Example showing booking page skeleton
  Rondevu.ns.skeletonDemo("inline", {
    elementOrSelector: "#rondevu-booking-place-skeletonDemo .place",
    rondevuLink: "pro/30min",
    config: {
      theme: "auto",
      iframeAttrs: {
        id: "rondevu-booking-place-skeletonDemo-iframe",
      },
      "flag.coep": "true",
      "cal.embed.pageType": "user.event.booking.slots",
    },
  });

  Rondevu.ns.skeletonDemo("on", {
    action: "*",
    callback,
  });
}

if (only === "all" || only === "ns:skeletonDemoElementClick") {
  Rondevu("init", "skeletonDemoElementClick", {
    debug: true,
    origin: origin,
  });

  Rondevu.ns.skeletonDemoElementClick("on", {
    action: "*",
    callback,
  });
}

if (only === "all" || only === "ns:containerScrollToTimeslot") {
  Rondevu("init", "containerScrollToTimeslot", {
    debug: true,
    origin,
  });
  Rondevu.ns.containerScrollToTimeslot("inline", {
    elementOrSelector: "#rondevu-booking-place-containerScrollToTimeslot .place",
    rondevuLink: "free/30min",
    config: {
      iframeAttrs: {
        id: "rondevu-booking-place-containerScrollToTimeslot-iframe",
      },
      "flag.coep": "true",
    },
  });
}

if (only === "all" || only === "ns:windowScrollToTimeslot") {
  Rondevu("init", "windowScrollToTimeslot", {
    debug: true,
    origin,
  });
  Rondevu.ns.windowScrollToTimeslot("inline", {
    elementOrSelector: "#rondevu-booking-place-windowScrollToTimeslot .place",
    rondevuLink: "free/30min",
    config: {
      iframeAttrs: {
        id: "rondevu-booking-place-windowScrollToTimeslot-iframe",
      },
      "flag.coep": "true",
    },
  });
}

// Keep it at the bottom as it works on the API defined above for various cases
(function ensureScrolledToCorrectIframe() {
  // Reset the hash so that we can scroll to correct iframe
  // Also, even if we need to scroll to the same iframe, we need to still reset it otherwise hashchange event will not fire
  location.hash = "";
  let api: typeof Rondevu | (typeof Rondevu)["ns"][string] | null = null;

  const getNamespace = () => {
    const url = new URL(document.URL);
    const only = url.searchParams.get("only") || "";
    return only !== "all" ? only.replace("ns:", "") : null;
  };

  const updateApiOnNamespaceChange = () => {
    const namespace = getNamespace();
    api = namespace && namespace !== "default" ? Rondevu.ns[namespace] : Rondevu;
    api?.("on", {
      action: "*",
      callback: (e) => {
        function scrollToIframeInPlayground() {
          const namespace = getNamespace();
          if (namespace) {
            location.hash = `#rondevu-booking-place-${namespace}-iframe`;
          }
        }
        scrollToIframeInPlayground();
      },
    });
  };

  // Initial namespace setup
  updateApiOnNamespaceChange();

  // Update namespace on hash change
  window.addEventListener("hashchange", updateApiOnNamespaceChange);
})();
