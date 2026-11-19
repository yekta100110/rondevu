import { createContainer } from "@rondevu/features/di/di";
import {
  type PolarWebhookService,
  moduleLoader as polarWebhookServiceModuleLoader,
} from "./PolarWebhookService.module";

const container = createContainer();

export function getPolarWebhookService(): PolarWebhookService {
  polarWebhookServiceModuleLoader.loadModule(container);
  return container.get<PolarWebhookService>(polarWebhookServiceModuleLoader.token);
}
