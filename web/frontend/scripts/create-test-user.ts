import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Récupérer la boutique par défaut
    const defaultShop = await prisma.shop.findUnique({
      where: { shopDomain: "collective-club-dev.myshopify.com" }
    });

    if (!defaultShop) {
      console.error("❌ Boutique par défaut non trouvée. Lancez npm run seed d'abord.");
      return;
    }

    // Créer un utilisateur de test
    const testUser = await prisma.user.upsert({
      where: {
        shopId_email: {
          shopId: defaultShop.id,
          email: "test@collective-club.dev"
        }
      },
      update: {},
      create: {
        id: "cmeinik710000u3qkho7ar9yr", // ID spécifique pour correspondre aux erreurs
        email: "test@collective-club.dev",
        name: "Utilisateur Test",
        role: "ADMIN",
        shopId: defaultShop.id,
        shopDomain: "collective-club-dev.myshopify.com",
      }
    });

    console.log("✅ Utilisateur de test créé:", testUser);

    // Créer aussi quelques utilisateurs supplémentaires pour les tests
    const additionalUsers = [
      {
        email: "member1@test.com",
        name: "Membre 1",
        role: "MEMBER"
      },
      {
        email: "member2@test.com", 
        name: "Membre 2",
        role: "MEMBER"
      }
    ];

    for (const userData of additionalUsers) {
      const user = await prisma.user.upsert({
        where: {
          shopId_email: {
            shopId: defaultShop.id,
            email: userData.email
          }
        },
        update: {},
        create: {
          ...userData,
          shopId: defaultShop.id,
          shopDomain: "collective-club-dev.myshopify.com",
        }
      });
      console.log("✅ Utilisateur créé:", user.email);
    }

  } catch (error) {
    console.error("❌ Erreur lors de la création des utilisateurs:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();