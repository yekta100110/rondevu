import { moduleLoader as eventTypeTranslationRepositoryModuleLoader } from "@rondevu/features/eventTypeTranslation/di/EventTypeTranslationRepository.module";
import type { EventTypeTranslationRepository } from "@rondevu/features/eventTypeTranslation/repositories/EventTypeTranslationRepository";
import { TRANSLATION_DI_TOKENS } from "@rondevu/features/translation/di/tokens";
import { TranslationService } from "@rondevu/features/translation/services/TranslationService";
import type { Container } from "@evyweb/ioctopus";
import { createModule, type ModuleLoader } from "../di";

const token: symbol = TRANSLATION_DI_TOKENS.TRANSLATION_SERVICE;
const moduleToken: symbol = TRANSLATION_DI_TOKENS.TRANSLATION_SERVICE_MODULE;

const loadModule = (container: Container) => {
  eventTypeTranslationRepositoryModuleLoader.loadModule(container);

  const eventTypeTranslationRepository = container.get<EventTypeTranslationRepository>(
    TRANSLATION_DI_TOKENS.EVENT_TYPE_TRANSLATION_REPOSITORY
  );

  const thisModule = createModule();
  thisModule.bind(token).toFactory(async () => {
    const { LingoDotDevService } = await import("@rondevu/lib/server/service/lingoDotDev");
    return new TranslationService({
      localizeText: (text, sourceLocale, targetLocale) =>
        LingoDotDevService.localizeText(text, sourceLocale, targetLocale),
      eventTypeTranslationRepository,
    });
  });

  container.load(moduleToken, thisModule);
};

export const moduleLoader: ModuleLoader = {
  token,
  loadModule,
};

export type { TranslationService };
