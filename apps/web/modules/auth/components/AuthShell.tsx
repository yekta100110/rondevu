"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

export function AuthShell({
  title,
  description,
  footer,
  children,
  wide = false,
}: {
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center px-4 sm:px-6">
        <Link
          href="/"
          aria-label="rOndevu"
          className="rounded-md font-semibold text-[22px] tracking-[-0.04em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
          rOndevu
        </Link>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pt-10 pb-16 sm:items-center sm:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease }}
          className={`grid w-full gap-6 ${wide ? "max-w-md" : "max-w-sm"}`}>
          {(title || description) && (
            <div className="grid gap-2 text-center">
              {title && <h1 className="text-balance font-semibold text-3xl tracking-[-0.045em]">{title}</h1>}
              {description && <p className="text-muted-foreground text-sm">{description}</p>}
            </div>
          )}
          <div className="rounded-xl border border-border bg-card p-6 text-card-foreground sm:p-8">{children}</div>
          {footer && <div className="text-center text-muted-foreground text-sm">{footer}</div>}
        </motion.div>
      </main>
    </div>
  );
}
