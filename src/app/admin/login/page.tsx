import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { adminPassword, isAdmin } from "@/lib/auth";
import { adminLogin } from "../actions";

export const metadata = { title: "Sign in" };

export default async function AdminLogin() {
  if (await isAdmin()) redirect("/admin");
  const configured = !!adminPassword();
  return (
    <div className="grid min-h-dvh place-items-center bg-brand-950 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <Image src="/brand/logo.png" alt="Nexgen Pharma" width={913} height={242} className="h-10 w-auto" priority />
        <h1 className="mt-8 text-2xl font-bold">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted">Manage leads, catalogue, clients and content.</p>
        <div className="mt-7">
          {configured ? (
            <LoginForm action={adminLogin} withEmail={false} />
          ) : (
            <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
              Admin login is not set up yet. Add an <code>ADMIN_PASSWORD</code> environment variable in Vercel and redeploy.
            </p>
          )}
        </div>
        <Link href="/" className="mt-6 block text-center text-sm text-muted hover:text-brand-700">
          ← Back to website
        </Link>
      </div>
    </div>
  );
}
