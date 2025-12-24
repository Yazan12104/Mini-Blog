import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET /api/posts
export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get("id");
	const page = parseInt(searchParams.get("page") || "1");
	const limit = parseInt(searchParams.get("limit") || "6");
	const skip = (page - 1) * limit;

	if (id) {
		const post = await prisma.post.findUnique({
			where: { id: parseInt(id) },
		});
		return NextResponse.json(post);
	}

	const [posts, total] = await prisma.$transaction([
		prisma.post.findMany({
			skip,
			take: limit,
			orderBy: { createdAt: "desc" },
		}),
		prisma.post.count(),
	]);

	return NextResponse.json({
		posts,
		pagination: {
			total,
			pages: Math.ceil(total / limit),
			current: page,
		},
	});
}

// POST /api/posts
export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });
	}

	try {
		const body = await req.json();

		if (!body.title || body.title.trim().length < 3) {
			return NextResponse.json(
				{ error: "العنوان يجب أن يكون 3 أحرف على الأقل" },
				{ status: 400 }
			);
		}

		const post = await prisma.post.create({
			data: {
				title: body.title,
				content: body.content,
			},
		});

		return NextResponse.json(post, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: "حدث خطأ غير متوقع" },
			{ status: 500 }
		);
	}
}

// DELETE /api/posts
export async function DELETE(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });
	}

	try {
		const { searchParams } = new URL(req.url);
		const id = searchParams.get("id");

		if (!id) {
			return NextResponse.json(
				{ error: "معرّف المقال مطلوب" },
				{ status: 400 }
			);
		}

		await prisma.post.delete({
			where: { id: Number(id) },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json(
			{ error: "فشل حذف المقال" },
			{ status: 500 }
		);
	}
}

// PUT /api/posts
export async function PUT(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });
	}

	try {
		const body = await req.json();

		if (!body.id) {
			return NextResponse.json(
				{ error: "معرّف المقال مطلوب" },
				{ status: 400 }
			);
		}

		if (!body.title || body.title.trim().length < 3) {
			return NextResponse.json(
				{ error: "العنوان يجب أن يكون 3 أحرف على الأقل" },
				{ status: 400 }
			);
		}

		const post = await prisma.post.update({
			where: { id: body.id },
			data: {
				title: body.title,
				content: body.content,
			},
		});

		return NextResponse.json(post);
	} catch (error) {
		return NextResponse.json(
			{ error: "فشل تعديل المقال" },
			{ status: 500 }
		);
	}
}
