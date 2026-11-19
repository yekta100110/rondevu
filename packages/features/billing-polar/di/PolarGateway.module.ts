import { bindModuleToClassOnToken, createModule, type ModuleLoader } from "@rondevu/features/di/di";
import { PolarSdkGateway } from "../lib/PolarSdkGateway";
import { moduleLoader as configModuleLoader } from "./PolarBillingConfig.module";
import { BILLING_POLAR_DI_TOKENS } from "./tokens";

const thisModule = createModule();
const token = BILLING_POLAR_DI_TOKENS.POLAR_GATEWAY;
const moduleToken = BILLING_POLAR_DI_TOKENS.POLAR_GATEWAY_MODULE;
const loadModule = bindModuleToClassOnToken({
  module: thisModule,
  moduleToken,
  token,
  classs: PolarSdkGateway,
  dep: configModuleLoader,
});

export const moduleLoader: ModuleLoader = { token, loadModule };
