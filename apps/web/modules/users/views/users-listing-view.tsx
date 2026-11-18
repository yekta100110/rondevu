"use client";

import NoSSR from "@rondevu/lib/components/NoSSR";
import { UsersTable } from "../components/UsersTable";

export default function UsersListingView() {
  return (
    <NoSSR>
      <UsersTable />
    </NoSSR>
  );
}
