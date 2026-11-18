"use client";

import { useActionState } from "react";
import { signIn } from "../actions";
import { inputClass, primaryButton } from "../ui";
import { Spinner } from "@/components/spinner";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, undefined);
  return (
    <form action={action} className="mt-5 space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-ink">Email</span>
        <input name="email" type="email" autoComplete="email" required className={inputClass} />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-ink">Password</span>
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </label>
      {state?.error && <p role="alert" className="text-sm font-medium text-red-700">{state.error}</p>}
      <button type="submit" disabled={pending} className={`${primaryButton} w-full`}>
        {pending ? <><Spinner /> Logging in…</> : "Log in"}
      </button>
    </form>
  );
}
