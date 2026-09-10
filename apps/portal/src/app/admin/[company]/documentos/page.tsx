import { redirect } from "next/navigation";

/*
 * ETAPA35A11C2D_R1B_R2_LEGACY_REDIRECT
 *
 * URL histórica mantida somente
 * para compatibilidade.
 *
 * Todo conteúdo real pertence ao
 * /dashboard/[company].
 *
 * Nenhum segundo AppShell é renderizado.
 */
export default async function LegacyCompanyDocumentosRedirect({
  params,
}: {
  params: Promise<{
    company: string;
  }>;
}) {

  const { company } =
    await params;

  if (!company) {
    redirect("/login");
  }

  redirect(
    `/dashboard/${
      encodeURIComponent(
        company
      )
    }?tab=arquivos-documentos`
  );
}
