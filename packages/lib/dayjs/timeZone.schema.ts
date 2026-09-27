import { z } from "zod";
import { sanitizeTimezone } from "./index";

// Schema for validating and sanitizing IANA timezone strings compatible with Intl.DateTimeFormat
// Gracefully transforms empty strings or unsupported timezones to a safe default (Europe/Istanbul)
export const timeZoneSchema = z.string().transform((timeZone) => sanitizeTimezone(timeZone));
