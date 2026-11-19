import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { Props } from "react-select";

import { useLocale } from "@rondevu/lib/hooks/useLocale";
import { Icon } from "@rondevu/ui/components/icon";
import { Label } from "@rondevu/ui/components/form";
import { Select } from "@rondevu/ui/components/form";
import { Avatar } from "@rondevu/ui/components/avatar";
import { EmptyScreen } from "@rondevu/ui/components/empty-screen";

export type CheckedUserSelectOption = {
  avatar: string;
  label: string;
  value: string;
  disabled?: boolean;
};

export const CheckedUserSelect = ({
  options = [],
  value = [],
  ...props
}: Omit<Props<CheckedUserSelectOption, true>, "value" | "onChange"> & {
  value?: readonly CheckedUserSelectOption[];
  onChange: (value: readonly CheckedUserSelectOption[]) => void;
}) => {
  const { t } = useLocale();

  const [animationRef] = useAutoAnimate<HTMLUListElement>();

  return (
    <>
      <Select
        name={props.name}
        placeholder={props.placeholder || t("select")}
        isSearchable={false}
        options={options}
        value={value}
        isMulti
        {...props}
      />
      {value.length > 0 ? (
        <div className="mt-6">
          <Label>{t("assigned_to")}</Label>
          <div className="flex overflow-hidden rounded-md border border-subtle bg-white">
            <ul className="w-full" data-testid="managed-event-types" ref={animationRef}>
              {value.map((option, index) => {
                return (
                  <li
                    key={option.value}
                    className={`flex px-3 py-2 ${index === value.length - 1 ? "" : "border-b"}`}>
                    <Avatar size="sm" imageSrc={option.avatar} alt={option.label} />
                    <p className="my-auto ml-3 text-sm text-emphasis">{option.label}</p>
                    <Icon
                      name="x"
                      onClick={() => props.onChange(value.filter((item) => item.value !== option.value))}
                      className="my-auto ml-auto"
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <EmptyScreen
            Icon="user-plus"
            headline={t("no_assigned_members")}
            description={t("start_assigning_members_above")}
          />
        </div>
      )}
    </>
  );
};

export default CheckedUserSelect;
