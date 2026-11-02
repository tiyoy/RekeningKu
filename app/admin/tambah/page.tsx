import { redirect } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import AccountForm from "@/components/AccountForm";
import { getAccounts } from "@/lib/accounts";
import { getAdminSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AddAccountPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");
  let nextOrder = 1;
  try { const accounts = await getAccounts(true); nextOrder = Math.max(0, ...accounts.map((item) => item.sortOrder)) + 1; } catch (error) { console.error(error); }
  return <AdminShell username={session.username} activeNav="rekening" pageTitle="Tambah Rekening Baru"><AccountForm nextOrder={nextOrder} /></AdminShell>;
}
