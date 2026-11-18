"use client";

import getBrandColours from "@rondevu/lib/getBrandColours";
import useTheme from "@rondevu/lib/hooks/useTheme";
import useMeQuery from "@rondevu/trpc/react/hooks/useMeQuery";
import { useCalcomTheme } from "@rondevu/ui/styles";

export const useAppTheme = () => {
  const { data: user } = useMeQuery();
  const brandTheme = getBrandColours({
    lightVal: user?.brandColor,
    darkVal: user?.darkBrandColor,
  });
  useCalcomTheme(brandTheme);
  useTheme(user?.appTheme);
};
