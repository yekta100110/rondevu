import type { ReactNode } from "react";

import classNames from "@rondevu/ui/classNames";

import { useAtomsContext } from "../../hooks/useAtomsContext";
import { RONDEVU_ATOMS_WRAPPER_CLASS } from "../constants/styles";

export const AtomsWrapper = ({
  children,
  customClassName,
}: {
  children: ReactNode;
  customClassName?: string;
}) => {
  const { options } = useAtomsContext();
  return (
    <div
      dir={options?.readingDirection ?? "ltr"}
      className={classNames(`${RONDEVU_ATOMS_WRAPPER_CLASS} m-0 w-auto bg-transparent p-0`, customClassName)}>
      {children}
    </div>
  );
};
