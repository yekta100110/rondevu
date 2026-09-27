import { sanitizeTimezone } from "@calcom/lib/dayjs";

export type Schedule = {
  isDefault: boolean;
  id: number;
  name: string;
  timeZone?: string | null;
  availability: {
    id: number;
    userId: number | null;
    startTime: Date;
    endTime: Date;
    eventTypeId: number | null;
    date: Date | null;
    days: number[];
    scheduleId: number | null;
  }[];
};

export const getScheduleListItemData = (schedule: Schedule) => ({
  ...schedule,
  timeZone: sanitizeTimezone(schedule.timeZone),
  availability: schedule.availability.map((avail) => ({
    ...avail,
    startTime: new Date(avail.startTime),
    endTime: new Date(avail.endTime),
    date: avail.date ? new Date(avail.date) : null,
  })),
});
