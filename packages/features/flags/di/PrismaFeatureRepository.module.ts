import { createModule, type ModuleLoader } from "@rondevu/features/di/di";
import { moduleLoader as prismaModuleLoader } from "@rondevu/features/di/modules/Prisma";
import type { Module } from "@evyweb/ioctopus";
import { PrismaFeatureRepository } from "../repositories/PrismaFeatureRepository";
import { FLAGS_DI_TOKENS } from "./tokens";

const thisModule: Module = createModule();
const token: symbol = FLAGS_DI_TOKENS.PRISMA_FEATURE_REPOSITORY;
const moduleToken: symbol = FLAGS_DI_TOKENS.PRISMA_FEATURE_REPOSITORY_MODULE;

thisModule.bind(token).toClass(PrismaFeatureRepository, [prismaModuleLoader.token]);

const loadModule = (container: ReturnType<typeof import("@rondevu/features/di/di").createContainer>): void => {
  container.load(moduleToken, thisModule);
  prismaModuleLoader.loadModule(container);
};

export const moduleLoader: ModuleLoader = {
  token,
  loadModule,
};

export type { PrismaFeatureRepository };
