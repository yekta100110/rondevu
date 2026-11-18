import { enrichUserWithDelegationCredentialsIncludeServiceAccountKey } from "@rondevu/app-store/delegationCredential";
import { withSelectedCalendars } from "@rondevu/lib/server/withSelectedCalendars";
import { availabilityUserSelect } from "@rondevu/prisma";
import { prisma } from "@rondevu/prisma";
import type { Prisma } from "@rondevu/prisma/client";
import { credentialForCalendarServiceSelect } from "@rondevu/prisma/selects/credential";

export async function findUsersForAvailabilityCheck({ where }: { where: Prisma.UserWhereInput }) {
  const user = await prisma.user.findFirst({
    where,
    select: {
      ...availabilityUserSelect,
      selectedCalendars: true,
      credentials: {
        select: credentialForCalendarServiceSelect,
      },
    },
  });

  if (!user) {
    return null;
  }

  return await enrichUserWithDelegationCredentialsIncludeServiceAccountKey({
    user: withSelectedCalendars(user),
  });
}
