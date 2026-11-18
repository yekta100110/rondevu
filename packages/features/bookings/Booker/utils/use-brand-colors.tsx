import useGetBrandingColours from "@rondevu/lib/getBrandColours";
import useTheme from "@rondevu/lib/hooks/useTheme";
import { useRondevuTheme } from "@rondevu/ui/styles";

export const useBrandColors = ({
  brandColor,
  darkBrandColor,
  theme,
}: {
  brandColor?: string;
  darkBrandColor?: string;
  theme?: string | null;
}) => {
  const brandTheme = useGetBrandingColours({
    lightVal: brandColor,
    darkVal: darkBrandColor,
  });

  useRondevuTheme(brandTheme);
  useTheme(theme);
};
