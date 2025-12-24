"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function UserMenu() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-text-muted hidden sm:inline-block">
          مرحباً، {session.user?.name || "Admin"}
        </span>
        <button
          onClick={() => signOut()}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-main transition-colors hover:bg-border"
        >
          خروج
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/auth/signin"
      className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-hover active:scale-95"
    >
      دخول المسؤول
    </Link>
  );
}
