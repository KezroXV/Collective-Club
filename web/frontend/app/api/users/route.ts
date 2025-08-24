import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/users - Créer un utilisateur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, shopDomain } = body;

    // Cette API ne devrait plus créer d'utilisateurs ADMIN
    // Les ADMIN sont créés uniquement via le callback OAuth Shopify
    const user = await prisma.user.upsert({
      where: { email },
      update: { name, shopDomain },
      create: {
        email,
        name,
        shopDomain,
        role: "MEMBER", // Tous les users créés via cette API sont MEMBER
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
