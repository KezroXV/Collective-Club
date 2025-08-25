import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTestData() {
  try {
    console.log("📊 Création de données de test pour chaque boutique...");

    // Récupérer les boutiques
    const shop1 = await prisma.shop.findUniqueOrThrow({
      where: { shopDomain: "collective-club.myshopify.com" }
    });
    
    const shop2 = await prisma.shop.findUniqueOrThrow({
      where: { shopDomain: "crossguildxv.myshopify.com" }
    });

    console.log(`Shop 1: ${shop1.shopName} (${shop1.id})`);
    console.log(`Shop 2: ${shop2.shopName} (${shop2.id})`);

    // Récupérer les admins
    const admin1 = await prisma.user.findFirstOrThrow({
      where: { shopId: shop1.id, role: "ADMIN" }
    });
    
    const admin2 = await prisma.user.findFirstOrThrow({
      where: { shopId: shop2.id, role: "ADMIN" }
    });

    // POSTS POUR COLLECTIVE-CLUB
    console.log("\n📝 Création de posts pour Collective-Club...");
    
    const postsShop1 = [
      {
        title: "🎉 Bienvenue chez Collective Club !",
        content: "Ceci est notre premier post dans la communauté Collective Club. Nous sommes ravis de vous accueillir !",
        authorId: admin1.id,
        shopId: shop1.id,
      },
      {
        title: "📦 Nouveaux produits en stock",
        content: "Découvrez notre nouvelle collection été 2024. Des pièces uniques vous attendent !",
        authorId: admin1.id,
        shopId: shop1.id,
      },
      {
        title: "💬 Partagez vos avis sur nos produits",
        content: "Nous aimerions connaître votre opinion sur nos dernières créations. N'hésitez pas à commenter !",
        authorId: admin1.id,
        shopId: shop1.id,
      }
    ];

    // POSTS POUR CROSSGUILDXV
    console.log("📝 Création de posts pour CrossGuildXV...");
    
    const postsShop2 = [
      {
        title: "⚔️ Bienvenue dans la Cross Guild XV !",
        content: "Rejoignez notre guilde de guerriers ! Ensemble, nous conquérons tous les défis.",
        authorId: admin2.id,
        shopId: shop2.id,
      },
      {
        title: "🎮 Nouveau tournoi gaming ce weekend",
        content: "Inscrivez-vous pour le grand tournoi ! Prix à gagner et honneur à la clé.",
        authorId: admin2.id,
        shopId: shop2.id,
      },
      {
        title: "🏆 Félicitations aux champions du mois",
        content: "Bravo à tous les participants du mois dernier. Voici le classement final !",
        authorId: admin2.id,
        shopId: shop2.id,
      },
      {
        title: "🛡️ Guide stratégique pour débutants",
        content: "Vous êtes nouveau ? Ce guide vous aidera à bien débuter dans notre communauté gaming.",
        authorId: admin2.id,
        shopId: shop2.id,
      }
    ];

    // Créer les posts
    let createdPosts1 = [];
    let createdPosts2 = [];

    for (const post of postsShop1) {
      const created = await prisma.post.create({
        data: post
      });
      createdPosts1.push(created);
      console.log(`✅ Post créé pour Collective-Club: "${post.title}"`);
    }

    for (const post of postsShop2) {
      const created = await prisma.post.create({
        data: post
      });
      createdPosts2.push(created);
      console.log(`✅ Post créé pour CrossGuildXV: "${post.title}"`);
    }

    // Créer des membres pour chaque boutique
    console.log("\n👥 Création de membres...");

    const member1Shop1 = await prisma.user.create({
      data: {
        email: "marie@collective-club.com",
        name: "Marie Dupont",
        role: "MEMBER",
        shopId: shop1.id,
        shopDomain: shop1.shopDomain,
      }
    });

    const member1Shop2 = await prisma.user.create({
      data: {
        email: "alex@crossguildxv.com", 
        name: "Alex Warrior",
        role: "MEMBER",
        shopId: shop2.id,
        shopDomain: shop2.shopDomain,
      }
    });

    // Ajouter des commentaires
    console.log("\n💬 Ajout de commentaires...");

    await prisma.comment.create({
      data: {
        content: "Super initiative ! J'adore cette communauté 😍",
        authorId: member1Shop1.id,
        postId: createdPosts1[0].id,
        shopId: shop1.id,
      }
    });

    await prisma.comment.create({
      data: {
        content: "Hâte de voir les nouveaux produits ! 🛍️",
        authorId: member1Shop1.id,
        postId: createdPosts1[1].id,
        shopId: shop1.id,
      }
    });

    await prisma.comment.create({
      data: {
        content: "LET'S GO TEAM! Je suis prêt pour le tournoi 🔥",
        authorId: member1Shop2.id,
        postId: createdPosts2[1].id,
        shopId: shop2.id,
      }
    });

    await prisma.comment.create({
      data: {
        content: "Merci pour ce guide, très utile pour un noob comme moi 😅",
        authorId: member1Shop2.id,
        postId: createdPosts2[3].id,
        shopId: shop2.id,
      }
    });

    // Ajouter des réactions
    console.log("\n❤️ Ajout de réactions...");

    await prisma.reaction.create({
      data: {
        type: "LOVE",
        userId: member1Shop1.id,
        postId: createdPosts1[0].id,
        shopId: shop1.id,
      }
    });

    await prisma.reaction.create({
      data: {
        type: "APPLAUSE",
        userId: member1Shop2.id,
        postId: createdPosts2[0].id,
        shopId: shop2.id,
      }
    });

    console.log("\n🎉 DONNÉES DE TEST CRÉÉES AVEC SUCCÈS !");
    console.log(`\n📊 Résumé :`);
    console.log(`• Collective-Club: ${postsShop1.length} posts, 1 membre, commentaires & réactions`);
    console.log(`• CrossGuildXV: ${postsShop2.length} posts, 1 membre, commentaires & réactions`);
    console.log(`\n🔍 Teste maintenant tes deux boutiques - elles devraient avoir des contenus différents !`);

  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData();