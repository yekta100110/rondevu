import { bindModuleToClassOnToken, createModule, type ModuleLoader } from "@rondevu/features/di/di";
import { BillingService } from "../services/BillingService";
import { moduleLoader as billingRepositoryModuleLoader } from "./BillingRepository.module";
import { moduleLoader as configModuleLoader } from "./PolarBillingConfig.module";
import { moduleLoader as polarGatewayModuleLoader } from "./PolarGateway.module";
import { BILLING_POLAR_DI_TOKENS } from "./tokens";

const thisModule = createModule();
const token = BILLING_POLAR_DI_TOKENS.BILLING_SERVICE;
const moduleToken = BILLING_POLAR_DI_TOKENS.BILLING_SERVICE_MODULE;
const loadModule = bindModuleToClassOnToken({
  module: thisModule,
  moduleToken,
  token,
  classs: BillingService,
  depsMap: {
    billingRepository: billingRepositoryModuleLoader,
    polarGateway: polarGatewayModuleLoader,
    config: configModuleLoader,
  },
});

export const moduleLoader: ModuleLoader = { token, loadModule };

export type { BillingService };
