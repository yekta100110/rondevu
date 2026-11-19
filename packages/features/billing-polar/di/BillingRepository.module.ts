import { bindModuleToClassOnToken, createModule, type ModuleLoader } from "@rondevu/features/di/di";
import { moduleLoader as prismaModuleLoader } from "@rondevu/features/di/modules/Prisma";
import { BillingRepository } from "../repositories/BillingRepository";
import { BILLING_POLAR_DI_TOKENS } from "./tokens";

const thisModule = createModule();
const token = BILLING_POLAR_DI_TOKENS.BILLING_REPOSITORY;
const moduleToken = BILLING_POLAR_DI_TOKENS.BILLING_REPOSITORY_MODULE;
const loadModule = bindModuleToClassOnToken({
  module: thisModule,
  moduleToken,
  token,
  classs: BillingRepository,
  dep: prismaModuleLoader,
});

export const moduleLoader: ModuleLoader = { token, loadModule };
