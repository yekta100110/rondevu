"use client";

import { useEffect, useRef } from "react";

import type { PrefillAndIframeAttrsConfig } from "@rondevu/embed-core";

import useEmbed from "./useEmbed";

type CalProps = {
  rondevuOrigin?: string;
  rondevuLink: string;
  initConfig?: {
    debug?: boolean;
    uiDebug?: boolean;
  };
  namespace?: string;
  config?: PrefillAndIframeAttrsConfig;
  embedJsUrl?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Rondevu = function Rondevu(props: CalProps) {
  const { rondevuLink, rondevuOrigin, namespace = "", config, initConfig = {}, embedJsUrl, ...restProps } = props;
  if (!rondevuLink) {
    throw new Error("rondevuLink is required");
  }
  const initializedRef = useRef(false);
  const Rondevu = useEmbed(embedJsUrl);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!Rondevu || initializedRef.current || !ref.current) {
      return;
    }
    initializedRef.current = true;
    const element = ref.current;
    if (namespace) {
      Rondevu("init", namespace, {
        ...initConfig,
        origin: rondevuOrigin,
      });
      Rondevu.ns[namespace]("inline", {
        elementOrSelector: element,
        rondevuLink,
        config,
      });
    } else {
      Rondevu("init", {
        ...initConfig,
        origin: rondevuOrigin,
      });
      Rondevu("inline", {
        elementOrSelector: element,
        rondevuLink,
        config,
      });
    }
  }, [Rondevu, rondevuLink, config, namespace, rondevuOrigin, initConfig]);

  if (!Rondevu) {
    return null;
  }

  return <div ref={ref} {...restProps} />;
};
export default Rondevu;
