import type { AppListCardProps } from "@rondevu/ui/components/app-list-card";
import { AppListCard } from "@rondevu/ui/components/app-list-card";

export default function AppListCardPlatformWrapper(props: AppListCardProps) {
  const logo = props.logo;
  return <AppListCard {...props} logo={logo} />;
}
