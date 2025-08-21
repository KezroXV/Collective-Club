/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/posts - Récupérer tous les posts avec sondages
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        category: {
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
        // ✅ INCLURE LE SONDAGE AVEC TOUTES SES DONNÉES
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

// POST /api/posts - Créer un nouveau post avec sondage
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, imageUrl, category, authorId, poll } = body; // ✅ AJOUTER poll

    if (!title || !content || !authorId) {
      return NextResponse.json(
        { error: "Title, content, and authorId are required" },
        { status: 400 }
      );
    }

    // Convertir category (nom) en categoryId
    let categoryId = null;
    if (category) {
      const foundCategory = await prisma.category.findUnique({
        where: { name: category },
      });
      if (foundCategory) {
        categoryId = foundCategory.id;
      }
    }

    // ✅ CRÉER LE POST AVEC SONDAGE
    const post = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl,
        categoryId,
        authorId,
        // ✅ CRÉER LE SONDAGE SI FOURNI
        ...(poll && {
          poll: {
            create: {
              question: poll.question,
              options: {
                create: poll.options.map((option: any, index: number) => ({
                  text: option.text,
                  order: index,
                })),
              },
            },
          },
        }),
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        category: {
          select: { id: true, name: true, color: true },
        },
        // ✅ INCLURE LE SONDAGE CRÉÉ
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
