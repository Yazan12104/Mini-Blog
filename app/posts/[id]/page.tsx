import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import EditPostForm from "@/app/components/EditPostForm";
import DeletePostButton from "@/app/components/DeletePostButton";
import ReactMarkdown from "react-markdown";

import { Metadata } from "next";

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });

  if (!post) {
    return {
      title: "المقال غير موجود",
    };
  }

  return {
    title: `${post.title} | Mini Blog`,
    description: post.content?.slice(0, 160) || "قراءة المقال على Mini Blog",
    openGraph: {
      title: post.title,
      description: post.content?.slice(0, 160),
      type: "article",
      publishedTime: post.createdAt.toISOString(),
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background pb-20 pt-24 text-right" dir="rtl">
       <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
             <path d="M19 12H5" />
             <path d="M12 19l7-7" />
             <path d="M12 5l7 7" />
          </svg>
          العودة للرئيسية
        </Link>
        
        <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
             <div className="border-b border-border bg-glass-bg backdrop-blur-sm p-8">
                 <div className="flex items-start justify-between">
                   <div>
                     <h1 className="text-3xl font-bold text-text-main sm:text-4xl leading-tight">
                       {post.title}
                     </h1>
                     <time className="mt-4 block text-sm text-text-muted">
                       {post.createdAt.toLocaleDateString("ar-EG", {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long', 
                          day: 'numeric'
                       })}
                     </time>
                   </div>
                   <div className="flex gap-2">
                     <EditPostForm
                         id={post.id}
                         initialTitle={post.title}
                         initialContent={post.content}
                       />
                     <DeletePostButton id={post.id} />
                   </div>
                 </div>
             </div>
             <div className="p-8">
                <div className="prose prose-lg prose-slate max-w-none text-text-main leading-relaxed dark:prose-invert">
                    <ReactMarkdown>
                        {post.content || ""}
                    </ReactMarkdown>
                </div>
             </div>
        </article>
       </div>
    </main>
  );
}
