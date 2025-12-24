"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function PostForm() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  if (!session) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (title.trim().length < 3) {
      setError("العنوان يجب أن يكون 3 أحرف على الأقل");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "حدث خطأ");
      setLoading(false);
      return;
    }

    setTitle("");
    setContent("");
    setLoading(false);

    router.refresh();
  }


  return (
    <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-border bg-surface/50 p-6 shadow-md backdrop-blur-sm transition-all focus-within:ring-2 focus-within:ring-primary/20">
      <h2 className="mb-4 text-xl font-bold text-text-main">إضافة مقال جديد</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="عنوان المقال"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text-main placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
        />
      </div>
      {error && <p className="mb-4 text-sm text-danger">{error}</p>}

      <div className="mb-4">
        <textarea
          placeholder="محتوى المقال"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text-main placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
        />
      </div>
      <p className="mb-4 text-xs text-text-muted">
        يدعم تنسيق Markdown (مثل **عريض**, - قائمة)
      </p>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-primary px-6 py-2.5 font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "جاري الحفظ..." : "نشر"}
        </button>
      </div>
    </form>
  );
}
