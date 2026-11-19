import { createContainer } from "@rondevu/features/di/di";
import { type BillingService, moduleLoader as billingServiceModuleLoader } from "./BillingService.module";

const container = createContainer();

export function getBillingService(): BillingService {
  billingServiceModuleLoader.loadModule(container);
  return container.get<BillingService>(billingServiceModuleLoader.token);
}
