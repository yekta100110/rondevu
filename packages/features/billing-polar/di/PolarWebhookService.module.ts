import { bindModuleToClassOnToken, createModule, type ModuleLoader } from "@rondevu/features/di/di";
import { PolarWebhookService } from "../services/PolarWebhookService";
import { moduleLoader as billingRepositoryModuleLoader } from "./BillingRepository.module";
import { moduleLoader as billingServiceModuleLoader } from "./BillingService.module";
import { moduleLoader as configModuleLoader } from "./PolarBillingConfig.module";
import { BILLING_POLAR_DI_TOKENS } from "./tokens";

const thisModule = createModule();
const token = BILLING_POLAR_DI_TOKENS.POLAR_WEBHOOK_SERVICE;
const moduleToken = BILLING_POLAR_DI_TOKENS.POLAR_WEBHOOK_SERVICE_MODULE;
const loadModule = bindModuleToClassOnToken({
  module: thisModule,
  moduleToken,
  token,
  classs: PolarWebhookService,
  depsMap: {
    billingService: billingServiceModuleLoader,
    billingRepository: billingRepositoryModuleLoader,
    config: configModuleLoader,
  },
});

export const moduleLoader: ModuleLoader = { token, loadModule };

export type { PolarWebhookService };
