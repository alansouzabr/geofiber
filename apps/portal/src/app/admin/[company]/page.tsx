import { redirect } from "next/navigation";

export default async function AdminCompanyEntry({
  params,
}: {
  params: Promise<{
    company: string;
  }>;
}) {
  const { company } = await params;

  if (!company) {
    redirect("/login");
  }

  redirect(`/dashboard/${company}`);
}
