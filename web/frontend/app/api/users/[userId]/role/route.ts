import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";

const prisma = new PrismaClient();

// PUT /api/users/[userId]/role - Changer le rôle d'un utilisateur (ADMIN ONLY)
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: targetUserId } = await params;
    const body = await request.json();
    const { adminUserId, role } = body;

    // Vérifier que l'utilisateur qui fait la demande est admin
    await requireAdmin(adminUserId);

    // Vérifier que le rôle est valide
    if (!['ADMIN', 'MODERATOR', 'MEMBER'].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be ADMIN, MODERATOR, or MEMBER" },
        { status: 400 }
      );
    }

    // Mettre à jour le rôle
    const user = await prisma.user.update({
      where: { id: targetUserId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        shopDomain: true,
      }
    });

    return NextResponse.json({
      message: `User role updated to ${role}`,
      user
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Seuls les administrateurs peuvent modifier les rôles" },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}