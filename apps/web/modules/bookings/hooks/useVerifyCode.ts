import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { useState } from "react";

export type UseVerifyCodeReturnType = ReturnType<typeof useVerifyCode>;

type UseVerifyCodeProps = {
  onSuccess: (isVerified: boolean, code?: string) => void;
};

export const useVerifyCode = ({ onSuccess }: UseVerifyCodeProps) => {
  const { t } = useLocale();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const [hasVerified, setHasVerified] = useState(false);
  const [lastSubmittedCode, setLastSubmittedCode] = useState<string>("");

  const verifyCodeMutationUserSessionRequired = {
    mutate: (..._args: unknown[]) => {},
    mutateAsync: async () => ({}),
    isPending: false,
  };

  const verifyCodeMutationUserSessionNotRequired = trpc.viewer.auth.verifyCodeUnAuthenticated.useMutation({
    onSuccess: (data, variables) => {
      setIsPending(false);
      onSuccess(data, variables?.code || lastSubmittedCode);
    },
    onError: (err) => {
      setIsPending(false);
      setHasVerified(false);
      if (err.message === "invalid_code") {
        setError(t("code_provided_invalid"));
      } else {
        setError(err.message || t("code_provided_invalid"));
      }
    },
  });

  const verifyCodeWithSessionRequired = (code: string, email: string) => {
    setLastSubmittedCode(code);
    verifyCodeMutationUserSessionRequired.mutate({
      code,
      email,
    });
  };

  const verifyCodeWithSessionNotRequired = (code: string, email: string) => {
    setLastSubmittedCode(code);
    verifyCodeMutationUserSessionNotRequired.mutate({
      code,
      email,
    });
  };

  return {
    verifyCodeWithSessionRequired,
    verifyCodeWithSessionNotRequired,
    isPending,
    setIsPending,
    error,
    value,
    hasVerified,
    setValue,
    setHasVerified,
    resetErrors: () => setError(""),
  };
};
