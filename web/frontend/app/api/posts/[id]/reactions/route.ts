/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/posts/[id]/reactions - Récupérer les réactions d'un post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const reactions = await prisma.reaction.findMany({
      where: { postId: id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Grouper par type de réaction
    const groupedReactions = reactions.reduce((acc: any, reaction) => {
      if (!acc[reaction.type]) {
        acc[reaction.type] = [];
      }
      acc[reaction.type].push(reaction.user);
      return acc;
    }, {});

    return NextResponse.json(groupedReactions);
  } catch (error) {
    console.error("Error fetching reactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch reactions" },
      { status: 500 }
    );
  }
}

// POST /api/posts/[id]/reactions - Ajouter/enlever une réaction
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { type, userId } = body;

    if (!type || !userId) {
      return NextResponse.json(
        { error: "Type and userId are required" },
        { status: 400 }
      );
    }

    // Vérifier si l'user a déjà réagi
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        postId: id,
        userId: userId,
      },
    });

    if (existingReaction) {
      if (existingReaction.type === type) {
        // Même réaction → enlever
        await prisma.reaction.delete({
          where: { id: existingReaction.id },
        });
        return NextResponse.json({ action: "removed", type });
      } else {
        // Réaction différente → changer
        const updatedReaction = await prisma.reaction.update({
          where: { id: existingReaction.id },
          data: { type },
        });
        return NextResponse.json({
          action: "updated",
          reaction: updatedReaction,
        });
      }
    } else {
      // Nouvelle réaction → créer
      const newReaction = await prisma.reaction.create({
        data: {
          type,
          userId,
          postId: id,
        },
      });
      return NextResponse.json({ action: "created", reaction: newReaction });
    }
  } catch (error) {
    console.error("Error managing reaction:", error);
    return NextResponse.json(
      { error: "Failed to manage reaction" },
      { status: 500 }
    );
  }
}
