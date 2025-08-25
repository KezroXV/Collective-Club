import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createRealShops() {
  try {
    console.log("🏪 Création des boutiques réelles...");

    // Boutique 1: collective-club
    const shop1 = await prisma.shop.upsert({
      where: { shopDomain: "collective-club.myshopify.com" },
      update: {},
      create: {
        shopDomain: "collective-club.myshopify.com",
        shopName: "Collective Club",
        ownerId: "collective-club-owner",
        settings: {
          environment: "production",
          createdVia: "manual-setup"
        }
      }
    });

    // Boutique 2: crossguildxv
    const shop2 = await prisma.shop.upsert({
      where: { shopDomain: "crossguildxv.myshopify.com" },
      update: {},
      create: {
        shopDomain: "crossguildxv.myshopify.com", 
        shopName: "Cross Guild XV",
        ownerId: "crossguildxv-owner",
        settings: {
          environment: "production",
          createdVia: "manual-setup"
        }
      }
    });

    console.log("✅ Boutique 1 créée/mise à jour:", shop1);
    console.log("✅ Boutique 2 créée/mise à jour:", shop2);

    // Créer des admins pour chaque boutique
    const admin1 = await prisma.user.upsert({
      where: {
        shopId_email: {
          shopId: shop1.id,
          email: "admin@collective-club.com"
        }
      },
      update: {},
      create: {
        email: "admin@collective-club.com",
        name: "Admin Collective Club",
        role: "ADMIN",
        shopId: shop1.id,
        shopDomain: "collective-club.myshopify.com",
      }
    });

    const admin2 = await prisma.user.upsert({
      where: {
        shopId_email: {
          shopId: shop2.id,
          email: "admin@crossguildxv.com"
        }
      },
      update: {},
      create: {
        email: "admin@crossguildxv.com",
        name: "Admin Cross Guild XV",
        role: "ADMIN", 
        shopId: shop2.id,
        shopDomain: "crossguildxv.myshopify.com",
      }
    });

    console.log("✅ Admin 1 créé/mis à jour:", admin1.email);
    console.log("✅ Admin 2 créé/mis à jour:", admin2.email);

    // Créer des catégories par défaut pour chaque boutique
    const categoriesShop1 = [
      { name: "Général", color: "bg-blue-500", description: "Discussions générales", order: 1 },
      { name: "Produits", color: "bg-green-500", description: "À propos de nos produits", order: 2 }
    ];

    const categoriesShop2 = [
      { name: "Général", color: "bg-purple-500", description: "Discussions générales", order: 1 },
      { name: "Gaming", color: "bg-red-500", description: "Discussions gaming", order: 2 }
    ];

    for (const cat of categoriesShop1) {
      await prisma.category.upsert({
        where: {
          shopId_name: {
            shopId: shop1.id,
            name: cat.name
          }
        },
        update: {},
        create: {
          ...cat,
          shopId: shop1.id
        }
      });
    }

    for (const cat of categoriesShop2) {
      await prisma.category.upsert({
        where: {
          shopId_name: {
            shopId: shop2.id,
            name: cat.name
          }
        },
        update: {},
        create: {
          ...cat,
          shopId: shop2.id
        }
      });
    }

    console.log("✅ Catégories créées pour les deux boutiques");

    console.log("\n🎉 Configuration complète !");
    console.log(`Shop 1 ID: ${shop1.id} (${shop1.shopDomain})`);
    console.log(`Shop 2 ID: ${shop2.id} (${shop2.shopDomain})`);

  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createRealShops();