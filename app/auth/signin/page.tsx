"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", {
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("كلمة المرور غير صحيحة");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface/50 p-8 shadow-xl backdrop-blur-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-text-main">
          تسجيل دخول المسؤول
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-text-muted">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text-main placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
              placeholder="••••••••"
            />
          </div>
          
          {error && <p className="mb-4 text-center text-sm text-danger">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white shadow-lg transition-all hover:bg-primary-hover hover:shadow-primary/25 active:scale-95"
          >
            دخول
          </button>
        </form>
      </div>
    </div>
  );
}
