"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { ParsedUrlQuery } from "node:querystring";
import { useEffect, useState } from "react";

import { WEBSITE_URL } from "@rondevu/lib/constants";
import { useLocale } from "@rondevu/lib/hooks/useLocale";
import { Button } from "@rondevu/ui/components/button";
import { CheckIcon } from "@coss/ui/icons";

import { AuthShell } from "@rondevu/web/modules/auth/components/AuthShell";

export type PageProps = {
  query: ParsedUrlQuery;
};

export function Logout(props: PageProps) {
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const { status } = useSession();
  if (status === "authenticated") signOut({ redirect: false });
  const router = useRouter();
  useEffect(() => {
    if (props.query?.survey === "true") {
      router.push(`${WEBSITE_URL}/cancellation`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.query?.survey]);
  const { t } = useLocale();

  const message = () => {
    if (props.query?.passReset === "true") return "reset_your_password";
    if (props.query?.emailChange === "true") return "email_change";
    return "hope_to_see_you_soon";
  };

  const navigateToLogin = () => {
    setBtnLoading(true);
    router.push("/auth/login");
  };

  return (
    <AuthShell>
      <div className="mb-4">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-border">
          <CheckIcon className="size-5 text-foreground" />
        </div>
        <div className="mt-4 text-center">
          <h1 className="font-semibold text-2xl tracking-[-0.04em]" id="modal-title">
            {t("youve_been_logged_out")}
          </h1>
          <div className="mt-2">
            <p className="text-muted-foreground text-sm">{t(message())}</p>
          </div>
        </div>
      </div>
      <Button
        data-testid="logout-btn"
        onClick={navigateToLogin}
        className="flex w-full justify-center"
        loading={btnLoading}>
        {t("go_back_login")}
      </Button>
    </AuthShell>
  );
}

export default Logout;
