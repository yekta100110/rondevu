import { defaultResponderForAppDir } from "app/api/defaultResponderForAppDir";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { handleWebhookScheduledTriggers } from "@rondevu/features/webhooks/lib/handleWebhookScheduledTriggers";
import { validateCronAuth } from "@rondevu/lib/validateCronAuth";
import prisma from "@rondevu/prisma";

async function postHandler(req: NextRequest) {
  if (!validateCronAuth(req)) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  await handleWebhookScheduledTriggers(prisma);

  return NextResponse.json({ ok: true });
}

export const POST = defaultResponderForAppDir(postHandler);
