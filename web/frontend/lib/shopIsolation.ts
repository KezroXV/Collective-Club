import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export interface ShopContext {
  shopId: string;
  shopDomain: string;
  shopName: string;
}

/**
 * Middleware pour l'isolation multi-tenant des boutiques Shopify
 * Récupère ou crée une boutique en fonction du shopDomain
 */
export async function getShopContext(request: NextRequest): Promise<ShopContext> {
  // Récupérer le shopDomain depuis les paramètres de requête Shopify
  const url = new URL(request.url);
  let shopDomain = url.searchParams.get('shop');
  
  console.log("🔍 DEBUG shopIsolation:");
  console.log("  URL:", request.url);
  console.log("  shop param:", shopDomain);
  console.log("  All search params:", Object.fromEntries(url.searchParams));
  
  // Vérifier dans les headers (Shopify peut envoyer dans des headers)
  if (!shopDomain) {
    const shopifyDomain = request.headers.get('x-shopify-shop-domain') || 
                         request.headers.get('x-shop-domain') ||
                         request.headers.get('shopify-shop-domain');
    if (shopifyDomain) {
      shopDomain = shopifyDomain;
      console.log("  🎯 Found in headers:", shopDomain);
    }
  }
  
  // Fallback pour le développement local
  if (!shopDomain) {
    // Vérifier les headers de referer ou host
    const referer = request.headers.get('referer');
    console.log("  Referer:", referer);
    if (referer) {
      const refererUrl = new URL(referer);
      shopDomain = refererUrl.searchParams.get('shop');
      console.log("  shop from referer:", shopDomain);
    }
  }
  
  // Vérifier dans le host/origin pour les apps Shopify
  if (!shopDomain) {
    const host = request.headers.get('host');
    const origin = request.headers.get('origin');
    console.log("  Host:", host);
    console.log("  Origin:", origin);
    
    // Si l'origine contient myshopify.com, l'utiliser
    if (origin && origin.includes('.myshopify.com')) {
      const match = origin.match(/https?:\/\/([^.]+)\.myshopify\.com/);
      if (match) {
        shopDomain = `${match[1]}.myshopify.com`;
        console.log("  🎯 Extracted from origin:", shopDomain);
      }
    }
  }
  
  // Dernière fallback pour le développement
  if (!shopDomain) {
    shopDomain = "collective-club-dev.myshopify.com";
    console.log("  ⚠️ Using fallback:", shopDomain);
  }
  
  console.log("  ✅ Final shopDomain:", shopDomain);
  
  // Normaliser le shopDomain
  if (!shopDomain.includes('.myshopify.com')) {
    shopDomain = `${shopDomain}.myshopify.com`;
  }

  // Récupérer ou créer la boutique
  let shop = await prisma.shop.findUnique({
    where: { shopDomain }
  });

  if (!shop) {
    // Créer une nouvelle boutique si elle n'existe pas
    shop = await prisma.shop.create({
      data: {
        shopDomain,
        shopName: extractShopName(shopDomain),
        ownerId: `owner-${Date.now()}`, // ID temporaire
        settings: {
          environment: process.env.NODE_ENV,
          createdVia: "auto-isolation"
        }
      }
    });
    
    console.log(`✅ Nouvelle boutique créée: ${shop.shopDomain} (ID: ${shop.id})`);
  } else {
    console.log(`🏪 Boutique trouvée: ${shop.shopDomain} (ID: ${shop.id})`);
  }

  return {
    shopId: shop.id,
    shopDomain: shop.shopDomain,
    shopName: shop.shopName
  };
}

/**
 * Récupère uniquement le shopId depuis une requête
 */
export async function getShopId(request: NextRequest): Promise<string> {
  const context = await getShopContext(request);
  return context.shopId;
}

/**
 * Extrait le nom de boutique depuis un domaine Shopify
 */
function extractShopName(shopDomain: string): string {
  const shopSlug = shopDomain.replace('.myshopify.com', '');
  return shopSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Middleware pour vérifier l'isolation des données
 * Utilisé pour s'assurer qu'un shopId est toujours fourni
 */
export function ensureShopIsolation(shopId: string) {
  if (!shopId) {
    throw new Error("shopId manquant - isolation multi-tenant obligatoire");
  }
  return shopId;
}

/**
 * Helper pour créer des catégories par défaut pour une nouvelle boutique
 */
export async function createDefaultCategoriesForShop(shopId: string) {
  const defaultCategories = [
    {
      name: "Général",
      color: "bg-blue-500",
      description: "Discussions générales",
      order: 1,
      shopId,
    },
    {
      name: "Produits",
      color: "bg-green-500", 
      description: "À propos de nos produits",
      order: 2,
      shopId,
    },
    {
      name: "Support",
      color: "bg-orange-500",
      description: "Questions et support",
      order: 3,
      shopId,
    }
  ];

  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: {
        shopId_name: {
          shopId,
          name: category.name,
        }
      },
      update: {},
      create: category,
    });
  }

  console.log(`✅ Catégories par défaut créées pour la boutique ${shopId}`);
}

/**
 * Helper pour créer un utilisateur admin par défaut pour une nouvelle boutique
 */
export async function createDefaultAdminForShop(shopId: string, shopDomain: string, ownerEmail?: string) {
  const adminEmail = ownerEmail || `admin@${shopDomain}`;
  
  const adminUser = await prisma.user.upsert({
    where: {
      shopId_email: {
        shopId,
        email: adminEmail,
      }
    },
    update: {},
    create: {
      email: adminEmail,
      name: "Propriétaire",
      role: "ADMIN",
      shopId,
      shopDomain,
    },
  });

  console.log(`✅ Utilisateur admin créé pour la boutique ${shopId}: ${adminEmail}`);
  return adminUser;
}