import { notFound, redirect } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import AccountForm from "@/components/AccountForm";
import { getAccount } from "@/lib/accounts";
import { getAdminSession } from "@/lib/session";
import type { Account } from "@/lib/types";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditAccountPage({ params }: PageProps) {
  const session = await getAdminSession();
  if (!session) redirect("/admin");
  const { id } = await params;
  let account: Account | null = null;
  try { account = await getAccount(id); } catch (error) { console.error(error); }
  if (!account) notFound();
  return <AdminShell username={session.username} activeNav="rekening" pageTitle="Edit Rekening"><AccountForm account={account} nextOrder={account.sortOrder} /></AdminShell>;
}
