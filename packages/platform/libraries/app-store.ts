import getEnabledAppsFromCredentials from "@rondevu/app-store/_utils/getEnabledAppsFromCredentials";
import getApps, { type CredentialDataWithTeamName } from "@rondevu/app-store/utils";
import handleDeleteCredential from "@rondevu/features/credentials/handleDeleteCredential";

export type { TDependencyData } from "@rondevu/app-store/_appRegistry";
export { BuildCalendarService } from "@rondevu/app-store/applecalendar/lib";
export { BuildCalendarService as BuildIcsFeedCalendarService } from "@rondevu/app-store/ics-feedcalendar/lib";
export type { CredentialOwner } from "@rondevu/app-store/types";
export type { CredentialDataWithTeamName, LocationOption } from "@rondevu/app-store/utils";
export { getAppFromSlug } from "@rondevu/app-store/utils";

export { getApps };

export { handleDeleteCredential };

export type { App } from "@rondevu/types/App";

export { getEnabledAppsFromCredentials };

export type { ConnectedApps } from "@rondevu/app-store/_utils/getConnectedApps";
export { getConnectedApps } from "@rondevu/app-store/_utils/getConnectedApps";
export { OAuth2UniversalSchema } from "@rondevu/app-store/_utils/oauth/universalSchema";
export {
  CalendarAppDelegationCredentialClientIdNotAuthorizedError,
  CalendarAppDelegationCredentialConfigurationError,
  CalendarAppDelegationCredentialError,
  CalendarAppDelegationCredentialInvalidGrantError,
  CalendarAppDelegationCredentialNotSetupError,
  CalendarAppError,
} from "@rondevu/lib/CalendarAppError";
export type { TServiceAccountKeySchema } from "@rondevu/prisma/zod-utils";
export type { AppsStatus } from "@rondevu/types/Calendar";
export type { CredentialPayload } from "@rondevu/types/Credential";

// Delegation credentials removed (EE feature) — stub for API v2
export const DelegationCredentialRepository = {
  findByIdIncludeSensitiveServiceAccountKey(_args: {
    id: string;
  }): Promise<{ serviceAccountKey: { client_email: string; private_key: string } | null } | null> {
    return Promise.resolve(null);
  },
};

export { getUsersCredentialsIncludeServiceAccountKey } from "@rondevu/app-store/delegationCredential";

// enrichUserWithDelegationConferencingCredentialsWithoutOrgId removed (EE feature) — stub for API v2
export async function enrichUserWithDelegationConferencingCredentialsWithoutOrgId(_args: {
  user: { credentials: unknown[]; [key: string]: unknown };
}): Promise<{ credentials: unknown[] }> {
  return { credentials: (_args.user.credentials as unknown[]) || [] };
}
