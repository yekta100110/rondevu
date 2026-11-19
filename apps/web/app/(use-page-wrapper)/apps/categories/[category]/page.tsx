import { getStaticProps } from "@lib/apps/categories/[category]/getStaticProps";
import { requirePaidAccess } from "@lib/billing/requirePaidAccess";
import { AppCategories } from "@rondevu/prisma/enums";
import type { PageProps } from "app/_types";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { z } from "zod";
import CategoryPage from "~/apps/categories/[category]/category-view";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const querySchema = z.object({
  category: z.enum(Object.values(AppCategories) as [AppCategories, ...AppCategories[]]),
});

async function Page({ params, searchParams }: PageProps) {
  await requirePaidAccess();
  const parsed = querySchema.safeParse({ ...(await params), ...(await searchParams) });
  if (!parsed.success) {
    redirect("/apps/categories/calendar");
  }

  const props = await getStaticProps(parsed.data.category);

  return <CategoryPage {...props} />;
}

export default Page;
