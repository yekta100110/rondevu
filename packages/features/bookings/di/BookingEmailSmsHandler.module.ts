import { BookingEmailSmsHandler } from "@rondevu/features/bookings/lib/BookingEmailSmsHandler";
import { bindModuleToClassOnToken, createModule, type ModuleLoader } from "@rondevu/features/di/di";
import { moduleLoader as loggerServiceModule } from "@rondevu/features/di/shared/services/logger.service";

import { BOOKING_DI_TOKENS } from "./tokens";

const thisModule = createModule();
const token = BOOKING_DI_TOKENS.BOOKING_EMAIL_SMS_HANDLER;
const moduleToken = BOOKING_DI_TOKENS.BOOKING_EMAIL_SMS_HANDLER_MODULE;
const loadModule = bindModuleToClassOnToken({
  module: thisModule,
  moduleToken,
  token,
  classs: BookingEmailSmsHandler,
  depsMap: {
    logger: loggerServiceModule,
  },
});

export const moduleLoader = {
  token,
  loadModule,
} satisfies ModuleLoader;
