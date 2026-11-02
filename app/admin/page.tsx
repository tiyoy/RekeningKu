import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/AdminLoginForm";
import { getAdminSession } from "@/lib/session";

export const metadata = { title: "Masuk Admin - RekeningKu" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin/dashboard");
  return <main className="login-page"><AdminLoginForm /></main>;
}
