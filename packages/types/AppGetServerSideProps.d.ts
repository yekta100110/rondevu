import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { RondevuSessionUser } from "next-auth";

import type prisma from "@rondevu/prisma";

export type AppUser = RondevuSessionUser | undefined;
export type AppPrisma = typeof prisma;
export type AppGetServerSidePropsContext = GetServerSidePropsContext<{
  pages: string[];
}>;

export type AppGetServerSideProps = (
  context: AppGetServerSidePropsContext,
  prisma: AppPrisma,
  user: AppUser
) => GetServerSidePropsResult;
