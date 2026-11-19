"use client";

import { signIn } from "next-auth/react";

import type { inferSSRProps } from "@rondevu/types/inferSSRProps";
import { Button } from "@rondevu/ui/components/button";

import { AuthShell } from "@rondevu/web/modules/auth/components/AuthShell";
import type { getServerSideProps } from "@server/lib/auth/signin/getServerSideProps";

export type PageProps = inferSSRProps<typeof getServerSideProps>;
function Signin({ providers }: PageProps) {
  if (!providers) {
    return null;
  }

  return (
    <AuthShell>
      <div className="grid gap-2">
        {Object.values(providers).map((provider) => {
          return (
            <Button key={provider.name} className="w-full justify-center" onClick={() => signIn(provider.id)}>
              Sign in with {provider.name}
            </Button>
          );
        })}
      </div>
    </AuthShell>
  );
}

export default Signin;
