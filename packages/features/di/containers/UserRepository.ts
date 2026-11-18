import { createContainer } from "@rondevu/features/di/di";
import { moduleLoader as userRepositoryModuleLoader } from "@rondevu/features/di/modules/User";
import type { UserRepository } from "@rondevu/features/users/repositories/UserRepository";

const userRepositoryContainer = createContainer();

export function getUserRepository(): UserRepository {
  userRepositoryModuleLoader.loadModule(userRepositoryContainer);
  return userRepositoryContainer.get<UserRepository>(userRepositoryModuleLoader.token);
}
