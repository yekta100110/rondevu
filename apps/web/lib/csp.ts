import process from "node:process";
import { IS_PRODUCTION, WEBAPP_URL } from "@calcom/lib/constants";
import { buildNonce } from "./buildNonce";

function getCspPolicy(nonce: string): string {
  //TODO: Do we need to explicitly define it in turbo.json
  const CSP_POLICY = process.env.CSP_POLICY ?? "non-strict";

  // Note: "non-strict" policy only allows inline styles otherwise it's the same as "strict"
  // We can remove 'unsafe-inline' from style-src when we add nonces to all style tags
  // Maybe see how @next-safe/middleware does it if it's supported.
  const useNonStrictPolicy = CSP_POLICY === "non-strict";

  // Marketing pages retain curated Framer image and font assets while the rest of the
  // product transitions under report-only coverage.
  return `
	  default-src 'self' ${IS_PRODUCTION ? "" : "data:"};
	  script-src ${
      IS_PRODUCTION
        ? // 'self' 'unsafe-inline' https: added for Browsers not supporting strict-dynamic
          `'nonce-${nonce}' 'strict-dynamic' 'self' 'unsafe-inline' https:`
        : // Note: We could use 'strict-dynamic' with 'nonce-..' instead of unsafe-inline but there are some streaming related scripts that get blocked(because they don't have nonce on them). It causes a really frustrating full page error model by Next.js to show up sometimes
          "'unsafe-inline' 'unsafe-eval' https: http:"
    };
    object-src 'none';
    base-uri 'none';
	  child-src 'self';
	  style-src 'self' ${
      IS_PRODUCTION ? (useNonStrictPolicy ? "'unsafe-inline'" : "") : "'unsafe-inline'"
    } https://framerusercontent.com;
  font-src 'self' https://framerusercontent.com data:;
  img-src 'self' ${WEBAPP_URL} https://img.youtube.com https://eu.ui-avatars.com/api/ https://framerusercontent.com data:;
    connect-src 'self' https://framerusercontent.com;
    form-action 'self';
	`;
}

export function getCspNonce(): string {
  const nonce = buildNonce(crypto.getRandomValues(new Uint8Array(22)));

  return nonce;
}

export function getCspHeader({ shouldEnforceCsp, nonce }: { shouldEnforceCsp: boolean; nonce: string }): {
  name: string;
  value: string;
} {
  const cspHeaderName = shouldEnforceCsp ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only";

  const cspHeaderValue = getCspPolicy(nonce)
    .replace(/\s{2,}/g, " ")
    .trim();

  return { name: cspHeaderName, value: cspHeaderValue };
}
