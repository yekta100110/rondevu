import { useIsEmbed } from "@rondevu/embed-core/embed-iframe";
import { useIsStandalone } from "@rondevu/lib/hooks/useIsStandalone";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ThemeToggle } from "./components/ThemeToggle";
import { Wordmark } from "./components/Wordmark";
import { KBarSearchField, KBarTrigger } from "./Kbar";
import { UserDropdown } from "./user-dropdown/UserDropdown";

export function TopNavContainer() {
  const { status } = useSession();
  const isStandalone = useIsStandalone();
  if (status !== "authenticated" || isStandalone) return null;
  return <TopNav />;
}

function TopNav() {
  const isEmbed = useIsEmbed();
  return (
    <nav
      style={isEmbed ? { display: "none" } : {}}
      className="sticky top-0 z-40 flex h-14 w-full items-center gap-1 border-subtle border-b bg-background/80 px-4 backdrop-blur-xl md:hidden">
      <Link href="/event-types" aria-label="rOndevu">
        <Wordmark className="text-[22px]" />
      </Link>
      <div className="ml-auto flex items-center gap-1">
        <KBarTrigger />
        <ThemeToggle />
        <UserDropdown small />
      </div>
    </nav>
  );
}

export function DesktopTopBarContainer() {
  const { status } = useSession();
  const isStandalone = useIsStandalone();
  const isEmbed = useIsEmbed();
  if (status !== "authenticated" || isStandalone || isEmbed) return null;
  return (
    <header className="sticky top-0 z-30 hidden h-14 shrink-0 items-center gap-2 border-subtle border-b bg-background/80 px-4 backdrop-blur-xl md:flex md:rounded-t-xl">
      <KBarSearchField />
      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
      </div>
    </header>
  );
}
