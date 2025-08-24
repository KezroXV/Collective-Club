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

    // Récupérer les infos du user Shopify pour déterminer son rôle
    console.log("🔥 Fetching user info from Shopify..."); 
    
    let userRole = "MEMBER"; // Par défaut
    let userName = `Utilisateur de ${shop}`;
    let userEmail = `user@${shop}`;
    
    try {
      // Utiliser l'API Shopify pour récupérer les infos du user actuel
      const client = new shopify.clients.Rest({
        session: callbackResponse.session!
      });
      
      // Récupérer les infos du shop pour voir qui est le owner
      const shopInfo = await client.get({
        path: 'shop'
      });
      
      console.log("🔍 Shop info:", shopInfo.body);
      
      // Le user qui fait l'OAuth est le propriétaire du shop = ADMIN
      // Tous les autres users qui passent par ici sont des employés = MEMBER
      userRole = "ADMIN"; // Pour l'instant, on assume que seul l'admin fait l'OAuth
      userName = `Admin de ${shop}`;
      userEmail = `admin@${shop}`;
      
    } catch (error) {
      console.error("❌ Error fetching Shopify user info:", error);
    }

    // Créer/récupérer l'user dans la DB
    console.log("🔥 Creating user with role:", userRole);

    const user = await prisma.user.upsert({
      where: { email: userEmail }, // Utiliser l'email comme clé unique
      update: {
        shopDomain: shop,
        name: userName,
        role: userRole, // Utiliser le rôle déterminé
      },
      create: {
        email: userEmail,
        name: userName,
        shopDomain: shop,
        role: userRole,
      },
    });

    console.log("✅ Auth successful for shop:", shop);
    console.log("✅ User created/updated:", user.id);

    return NextResponse.redirect(
      `${process.env.HOST}/?shop=${shop}&authenticated=true&userId=${user.id}`
    );
  } catch (error) {
    console.error("❌ Auth callback error:", error);
    return NextResponse.redirect(
      `${process.env.HOST}/error?message=auth_failed`
    );
  }
}
