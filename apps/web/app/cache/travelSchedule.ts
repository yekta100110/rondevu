"use server";

import { revalidateTag } from "next/cache";

import { TravelScheduleRepository } from "@rondevu/features/travelSchedule/repositories/TravelScheduleRepository";
import { NEXTJS_CACHE_TTL } from "@rondevu/lib/constants";
import { unstable_cache } from "@rondevu/lib/unstable_cache";

const CACHE_TAGS = {
  TRAVEL_SCHEDULES: "TravelRepository.findTravelSchedulesByUserId",
} as const;

export const getTravelSchedule = unstable_cache(
  async (userId: number) => {
    return await TravelScheduleRepository.findTravelSchedulesByUserId(userId);
  },
  ["getTravelSchedule"],
  {
    revalidate: NEXTJS_CACHE_TTL,
    tags: [CACHE_TAGS.TRAVEL_SCHEDULES],
  }
);

export const revalidateTravelSchedules = async () => {
  revalidateTag(CACHE_TAGS.TRAVEL_SCHEDULES, "max");
};
