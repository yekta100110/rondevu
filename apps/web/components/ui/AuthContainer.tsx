import classNames from "classnames";
import Link from "next/link";

import Loader from "@components/Loader";

interface Props {
  footerText?: React.ReactNode | string;
  showLogo?: boolean;
  heading?: string;
  loading?: boolean;
}

export default function AuthContainer(props: React.PropsWithChildren<Props>) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {props.showLogo && (
        <header className="mx-auto flex h-16 w-full max-w-6xl items-center px-4 sm:px-6">
          <Link href="/" className="font-semibold text-[22px] tracking-[-0.04em]">
            rOndevu
          </Link>
        </header>
      )}
      {props.loading && (
        <div className="absolute z-50 flex h-screen w-full items-center bg-background/80">
          <Loader />
        </div>
      )}
      <main className="flex flex-1 items-start justify-center px-4 pt-10 pb-16 sm:items-center sm:pt-0">
        <div className="grid w-full max-w-sm gap-6">
          {props.heading && (
            <h1
              className={classNames(
                "text-balance text-center font-semibold text-3xl tracking-[-0.045em]",
                !props.showLogo && "mt-8"
              )}>
              {props.heading}
            </h1>
          )}
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">{props.children}</div>
          {props.footerText && (
            <div className="text-center text-muted-foreground text-sm">{props.footerText}</div>
          )}
        </div>
      </main>
    </div>
  );
}
