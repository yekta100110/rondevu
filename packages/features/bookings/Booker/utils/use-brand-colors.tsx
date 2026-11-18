import useGetBrandingColours from "@rondevu/lib/getBrandColours";
import useTheme from "@rondevu/lib/hooks/useTheme";
import { useCalcomTheme } from "@rondevu/ui/styles";

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

  useCalcomTheme(brandTheme);
  useTheme(theme);
};
