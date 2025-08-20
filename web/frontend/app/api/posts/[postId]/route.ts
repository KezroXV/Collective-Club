import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.postId },
      include: {
        author: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        category: {
          select: { id: true, name: true, color: true },
        },
        poll: {
          include: {
            options: {
              include: {
                _count: {
                  select: { votes: true },
                },
              },
              orderBy: { order: "asc" },
            },
            _count: {
              select: { votes: true },
            },
          },
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        reactions: true,
        _count: {
          select: { comments: true, reactions: true },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
