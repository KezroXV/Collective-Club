import { NextRequest, NextResponse } from "next/server";
import { shopifyApi, ApiVersion } from "@shopify/shopify-api";
import { PrismaClient } from "@prisma/client";
import "@shopify/shopify-api/adapters/node";

const prisma = new PrismaClient();

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  scopes: [
    "read_customers",
    "write_customers",
    "read_content",
    "write_content",
  ],
  hostName: process.env.HOST!.replace(/https?:\/\//, ""),
  apiVersion: ApiVersion.October24,
  isEmbeddedApp: false,
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  console.log("🔥 CALLBACK CALLED!"); // ✅ Ajoute ça

  try {
    const callbackResponse = await shopify.auth.callback({
      rawRequest: request,
    });

    console.log("🔥 Callback response:", callbackResponse); // ✅ Ajoute ça

    const shop = callbackResponse.session?.shop;

    if (!shop) {
      throw new Error("No shop found in session");
    }

    console.log("🔥 Shop found:", shop); // ✅ Ajoute ça

    // Créer/récupérer l'user admin dans la DB
    console.log("🔥 Creating user..."); // ✅ Ajoute ça

    const adminUser = await prisma.user.upsert({
      where: { shopDomain: shop },
      update: {
        shopDomain: shop,
        name: `Admin de ${shop}`,
      },
      create: {
        email: `admin@${shop}`,
        name: `Admin de ${shop}`,
        shopDomain: shop,
        role: "ADMIN",
      },
    });

    console.log("✅ Auth successful for shop:", shop);
    console.log("✅ User created/updated:", adminUser.id);

    return NextResponse.redirect(
      `${process.env.HOST}/?shop=${shop}&authenticated=true&userId=${adminUser.id}`
    );
  } catch (error) {
    console.error("❌ Auth callback error:", error);
    return NextResponse.redirect(
      `${process.env.HOST}/error?message=auth_failed`
    );
  }
}
