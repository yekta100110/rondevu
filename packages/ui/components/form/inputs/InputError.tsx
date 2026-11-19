import { InfoIcon } from "@coss/ui/icons";

type InputErrorProp = {
  message: string;
};

export const InputError = ({ message }: InputErrorProp) => (
  <div data-testid="field-error" className="text-error mt-1.5 flex items-center gap-x-1.5 text-[13px]">
    <div>
      <InfoIcon className="h-3 w-3" />
    </div>
    <p>{message}</p>
  </div>
);
