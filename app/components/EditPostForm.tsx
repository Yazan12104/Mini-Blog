"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Props = {
  id: number;
  initialTitle: string;
  initialContent: string | null;
};

export default function EditPostForm({
  id,
  initialTitle,
  initialContent,
}: Props) {
  const { data: session } = useSession();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent || "");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  if (!session) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (title.trim().length < 3) {
      setError("العنوان يجب أن يكون 3 أحرف على الأقل");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/posts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        title,
        content,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "حدث خطأ");
      setLoading(false);
      return;
    }

    setEditing(false);
    setLoading(false);
    router.refresh();
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="group relative flex items-center justify-center rounded-lg p-2 text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20"
        title="تعديل المقال"
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
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
        </svg>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 rounded-xl border border-border bg-background p-4 shadow-sm">
      <div className="mb-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-main placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          placeholder="العنوان"
        />
      </div>

      <div className="mb-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-main placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          rows={3}
          placeholder="المحتوى"
        />
      </div>
      <p className="mb-3 text-xs text-text-muted">
        يدعم تنسيق Markdown
      </p>

      {error && <p className="mb-3 text-xs text-danger">{error}</p>}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-text-muted hover:bg-surface hover:text-text-main"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-primary-hover active:scale-95 disabled:opacity-70"
        >
          {loading ? "حفظ..." : "حفظ التعديلات"}
        </button>
      </div>
    </form>
  );
}
