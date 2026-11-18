"use client";

import type { GlobalCal, GlobalCalWithoutNs } from "@rondevu/embed-core";
import EmbedSnippet from "@rondevu/embed-snippet";

import Rondevu from "./Rondevu";

// Exporting for consumption by @rondevu/embed-react user
export type { EmbedEvent } from "@rondevu/embed-core";

export function getRondevuApi(options?: {
  embedJsUrl?: string;
  namespace?: string;
}): Promise<GlobalCal | GlobalCalWithoutNs>;
export function getRondevuApi(embedJsUrl: string): Promise<GlobalCal | GlobalCalWithoutNs>;

export function getRondevuApi(
  optionsOrEmbedJsUrl?:
    | {
        embedJsUrl?: string;
        namespace?: string;
      }
    | string
): Promise<GlobalCal | GlobalCalWithoutNs> {
  const options =
    typeof optionsOrEmbedJsUrl === "string" ? { embedJsUrl: optionsOrEmbedJsUrl } : optionsOrEmbedJsUrl ?? {};

  const { namespace = "", embedJsUrl } = options;
  return new Promise(function tryReadingFromWindow(resolve) {
    const globalCal = EmbedSnippet(embedJsUrl);
    globalCal("init", namespace);
    const api = namespace ? globalCal.ns[namespace as keyof typeof globalCal.ns] : globalCal;
    if (!api) {
      setTimeout(() => {
        tryReadingFromWindow(resolve);
      }, 50);
      return;
    }
    resolve(api);
  });
}

export default Rondevu;
