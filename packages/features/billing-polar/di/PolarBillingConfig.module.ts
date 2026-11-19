import { type Container, createModule, type ModuleLoader } from "@rondevu/features/di/di";
import { readPolarBillingConfig } from "../lib/config";
import { BILLING_POLAR_DI_TOKENS } from "./tokens";

const thisModule = createModule();
const token = BILLING_POLAR_DI_TOKENS.POLAR_BILLING_CONFIG;
const moduleToken = BILLING_POLAR_DI_TOKENS.POLAR_BILLING_CONFIG_MODULE;
thisModule.bind(token).toFactory(() => readPolarBillingConfig(), "singleton");

export const moduleLoader: ModuleLoader = {
  token,
  loadModule: (container: Container) => {
    container.load(moduleToken, thisModule);
  },
};
