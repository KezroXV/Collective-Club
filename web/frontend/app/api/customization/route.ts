import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - Récupérer les paramètres de personnalisation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Récupérer ou créer les paramètres par défaut
    let settings = await prisma.customizationSettings.findUnique({
      where: { userId },
    });

    // Si pas de paramètres existants, créer avec les valeurs par défaut
    if (!settings) {
      settings = await prisma.customizationSettings.create({
        data: {
          userId,
          colorPosts: "#3B82F6",
          colorBorders: "#E5E7EB", 
          colorBg: "#F9FAFB",
          colorText: "#111827",
          selectedFont: "Helvetica",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching customization settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch customization settings" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour les paramètres de personnalisation (ADMIN ONLY)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Vérifier les droits admin
    await requireAdmin(body.userId);
    const {
      userId,
      colorPosts,
      colorBorders,
      colorBg,
      colorText,
      selectedFont,
      coverImageUrl,
      customBadges,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Upsert (créer ou mettre à jour)
    const settings = await prisma.customizationSettings.upsert({
      where: { userId },
      update: {
        colorPosts: colorPosts || "#3B82F6",
        colorBorders: colorBorders || "#E5E7EB",
        colorBg: colorBg || "#F9FAFB", 
        colorText: colorText || "#111827",
        selectedFont: selectedFont || "Helvetica",
        coverImageUrl: coverImageUrl || null,
        customBadges: customBadges || null,
      },
      create: {
        userId,
        colorPosts: colorPosts || "#3B82F6",
        colorBorders: colorBorders || "#E5E7EB",
        colorBg: colorBg || "#F9FAFB",
        colorText: colorText || "#111827", 
        selectedFont: selectedFont || "Helvetica",
        coverImageUrl: coverImageUrl || null,
        customBadges: customBadges || null,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating customization settings:", error);
    
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Seuls les administrateurs peuvent modifier les paramètres de personnalisation" },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update customization settings" },
      { status: 500 }
    );
  }
}