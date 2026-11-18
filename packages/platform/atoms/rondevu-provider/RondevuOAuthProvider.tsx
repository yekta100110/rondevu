"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

import { VERSION_2024_06_14 } from "@rondevu/platform-constants";

import http from "../lib/http";
import type { BaseRondevuProviderProps } from "./BaseRondevuProvider";
import { BaseRondevuProvider } from "./BaseRondevuProvider";
import type { translationKeys } from "./languages";

const queryClient = new QueryClient();

type RondevuOAuthProviderProps = Omit<BaseRondevuProviderProps, "isOAuth2">;

/**
 * Renders a RondevuProvider component.
 *
 * @component
 * @param {string} props.clientId - The platform oauth client ID.
 * @param {string} props.accessToken - The access token of your managed user. - Optional
 * @param {object} props.options - The options object.
 * @param {string} [options.apiUrl] - The API URL. https://api.rondevu.org/v2
 * @param {string} [options.refreshUrl] - The url point to your refresh endpoint. - Optional, required if accessToken is provided.
 * @param {boolean} [autoUpdateTimezone=true] - Whether to automatically update the timezone. - Optional
 * @param {function} props.onTimezoneChange - The callback function for timezone change. - Optional
 * @param {ReactNode} props.children - The child components. - Optional
 * @returns {JSX.Element} The rendered RondevuProvider component.
 */
export function RondevuOAuthProvider({
  clientId,
  accessToken,
  options,
  children,
  autoUpdateTimezone = true,
  labels,
  language = "en",
  onTimezoneChange,
  version = VERSION_2024_06_14,
  organizationId,
  isEmbed = false,
}: RondevuOAuthProviderProps) {
  useEffect(() => {
    http.setVersionHeader(version);
  }, [version]);

  useEffect(() => {
    if (accessToken) {
      queryClient.resetQueries();
    }
  }, [accessToken]);

  useEffect(() => {
    http.setPlatformEmbedHeader(isEmbed);
  }, [isEmbed]);

  return (
    <QueryClientProvider client={queryClient}>
      <BaseRondevuProvider
        isEmbed={isEmbed}
        isOAuth2={true}
        autoUpdateTimezone={autoUpdateTimezone}
        onTimezoneChange={onTimezoneChange}
        clientId={clientId}
        accessToken={accessToken}
        options={options}
        version={version}
        labels={labels as Record<translationKeys, string>}
        language={language}
        organizationId={organizationId}>
        {children}
      </BaseRondevuProvider>
    </QueryClientProvider>
  );
}
