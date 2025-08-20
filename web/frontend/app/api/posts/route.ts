import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/posts - Récupérer tous les posts
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        category: {
          // ✅ AJOUTER la relation category
          select: { id: true, name: true, color: true },
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
        reactions: true,
        _count: {
          select: { comments: true, reactions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST /api/posts - Créer un nouveau post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, imageUrl, category, authorId } = body; // ✅ category reste tel quel depuis le front

    if (!title || !content || !authorId) {
      return NextResponse.json(
        { error: "Title, content, and authorId are required" },
        { status: 400 }
      );
    }

    // ✅ NOUVEAU : Convertir category (nom) en categoryId
    let categoryId = null;
    if (category) {
      const foundCategory = await prisma.category.findUnique({
        where: { name: category },
      });
      if (foundCategory) {
        categoryId = foundCategory.id;
      }
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl,
        categoryId, // ✅ UTILISER categoryId au lieu de category
        authorId,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        category: {
          // ✅ INCLURE la relation category
          select: { id: true, name: true, color: true },
        },
        _count: {
          select: { comments: true, reactions: true },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
