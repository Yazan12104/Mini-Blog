"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function DeletePostButton({ id }: { id: number }) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) return null;

  async function handleDelete() {
    const confirmDelete = confirm("هل أنت متأكد من حذف هذا المقال؟");
    if (!confirmDelete) return;

    await fetch(`/api/posts?id=${id}`, {
      method: "DELETE",
    });

    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="group relative flex items-center justify-center rounded-lg p-2 text-danger hover:bg-danger/10 focus:outline-none focus:ring-2 focus:ring-danger/20"
      title="حذف المقال"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 transition-transform group-hover:scale-110"
      >
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </svg>
    </button>
  );
}
