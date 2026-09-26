import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { validateCronAuth } from "@calcom/lib/validateCronAuth";

import tasker from "..";

export async function GET(request: NextRequest) {
  if (!validateCronAuth(request)) {
    return new Response("Unauthorized", { status: 401 });
  }
  await tasker.cleanup();
  return NextResponse.json({ success: true });
}
