import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/users - Créer un utilisateur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, shopDomain } = body;

    const user = await prisma.user.upsert({
      where: { email },
      update: { name, shopDomain },
      create: {
        email,
        name,
        shopDomain,
        role: "ADMIN", // Premier user = admin
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
