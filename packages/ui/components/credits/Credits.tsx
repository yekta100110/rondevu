"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { RONDEVU_VERSION, COMPANY_NAME, IS_RONDEVU, IS_SELF_HOSTED } from "@rondevu/lib/constants";

// eslint-disable-next-line turbo/no-undeclared-env-vars
const vercelCommitHash = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;
const commitHash = vercelCommitHash ? `-${vercelCommitHash.slice(0, 7)}` : "";
const RondevuVersion = `v.${RONDEVU_VERSION}-${!IS_SELF_HOSTED ? "h" : "sh"}`;

export default function Credits() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <small className="text-default mx-3 mb-2 mt-1 hidden text-[0.5rem] opacity-50 lg:block">
      &copy; {new Date().getFullYear()}{" "}
      <Link href="https://rondevu.org" target="_blank" className="hover:underline">
        {COMPANY_NAME}
      </Link>{" "}
      {hasMounted && (
        <>
          <Link href="https://rondevu.org/releases" target="_blank" className="hover:underline">
            {RondevuVersion}
          </Link>
          {vercelCommitHash && IS_RONDEVU ? (
            <Link
              href="https://rondevu.org"
              target="_blank"
              className="hover:underline">
              {commitHash}
            </Link>
          ) : (
            commitHash
          )}
        </>
      )}
    </small>
  );
}
