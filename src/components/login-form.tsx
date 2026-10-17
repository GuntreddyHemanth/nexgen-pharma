"use client";

import { useActionState } from "react";
import { Loader2, LogIn } from "lucide-react";

type LoginState = { error?: string };

export function LoginForm({
  action,
  withEmail = true,
  submitLabel = "Sign in",
}: {
  action: (prev: LoginState, fd: FormData) => Promise<LoginState>;
  withEmail?: boolean;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className="grid gap-5">
      {withEmail && (
        <label className="grid gap-1.5 text-sm font-medium">
          Email
          <input name="email" type="email" required autoComplete="username" className="field" placeholder="you@company.com" />
        </label>
      )}
      <label className="grid gap-1.5 text-sm font-medium">
        Password
        <input name="password" type="password" required autoComplete="current-password" className="field" />
      </label>
      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
        {submitLabel}
      </button>
    </form>
  );
}
