import { prisma } from "@/lib/prisma";
import PostForm from "./components/PostForm";
import DeletePostButton from "./components/DeletePostButton";
import EditPostForm from "./components/EditPostForm";
import Link from "next/link";
import UserMenu from "./components/UserMenu";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || "1");
  const limit = 6;
  const skip = (page - 1) * limit;

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.post.count(),
  ]);

  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-glass-bg backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            Mini Blog
          </h1>
           <div className="flex items-center gap-4">
             <UserMenu />
             <span className="rounded-full bg-surface px-3 py-1 text-sm font-medium text-text-muted shadow-sm border border-border">
              {total} مقالات
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Create Post Section */}
        {session && (
          <section className="mb-12">
            <div className="mx-auto max-w-2xl">
              <PostForm />
            </div>
          </section>
        )}

        {/* Posts Grid */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text-main">أحدث المقالات (صفحة {page})</h2>
          </div>
          
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li
                key={post.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div>
                  <Link href={`/posts/${post.id}`}>
                    <h2 className="mb-3 text-xl font-bold text-text-main line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                      {post.title}
                    </h2>
                  </Link>
                  {post.content && (
                    <Link href={`/posts/${post.id}`}>
                      <p className="mb-4 text-text-muted line-clamp-3 cursor-pointer">
                        {post.content}
                      </p>
                    </Link>
                  )}
                </div>

                <div className="mt-4 border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted">
                      {post.createdAt.toLocaleDateString("ar-EG")}
                    </span>
                    <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <EditPostForm
                        id={post.id}
                        initialTitle={post.title}
                        initialContent={post.content}
                      />
                      <DeletePostButton id={post.id} />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          {posts.length === 0 && (
             <div className="flex flex-col items-center justify-center py-20 text-center text-text-muted">
               <p className="text-lg">لا توجد مقالات حتى الآن</p>
               <p className="text-sm">قم بإضافة أول مقال لك!</p>
             </div>
          )}

          {/* Pagination Controls */}
          {(hasPrev || hasNext) && (
            <div className="mt-12 flex justify-center gap-4">
              <Link
                href={`/?page=${page - 1}`}
                className={`rounded-xl border border-border bg-surface px-6 py-2.5 font-medium transition-all ${
                  !hasPrev
                    ? "pointer-events-none opacity-50"
                    : "hover:bg-primary/5 hover:border-primary/20 text-text-main"
                }`}
                aria-disabled={!hasPrev}
              >
                السابق
              </Link>
              <Link
                href={`/?page=${page + 1}`}
                className={`rounded-xl border border-border bg-surface px-6 py-2.5 font-medium transition-all ${
                  !hasNext
                    ? "pointer-events-none opacity-50"
                    : "hover:bg-primary/5 hover:border-primary/20 text-text-main"
                }`}
                aria-disabled={!hasNext}
              >
                التالي
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
