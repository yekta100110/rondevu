import { BookerPlatformWrapper } from "../booker/BookerPlatformWrapper";
import type {
  BookerPlatformWrapperAtomPropsForIndividual,
  BookerPlatformWrapperAtomPropsForTeam,
} from "../booker/types";
import { RondevuProvider } from "../rondevu-provider/RondevuProvider";

type BookerEmbedProps =
  | (BookerPlatformWrapperAtomPropsForIndividual & {
      organizationId?: number;
      apiUrl?: string;
    })
  | (BookerPlatformWrapperAtomPropsForTeam & {
      organizationId?: number;
      apiUrl?: string;
    });

export const BookerEmbed = (props: BookerEmbedProps) => {
  const { apiUrl, organizationId, ...restProps } = props;

  return (
    <RondevuProvider
      clientId={import.meta.env.VITE_BOOKER_EMBED_OAUTH_CLIENT_ID}
      isEmbed={true}
      organizationId={organizationId}
      options={{
        apiUrl: apiUrl ?? import.meta.env.VITE_BOOKER_EMBED_API_URL,
      }}>
      <BookerPlatformWrapper {...restProps} />
    </RondevuProvider>
  );
};
