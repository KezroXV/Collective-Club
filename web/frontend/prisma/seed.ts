import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Créer les catégories par défaut
  const categories = [
    {
      name: "Maison",
      color: "bg-orange-500",
      description: "Tout pour la maison et la décoration",
      order: 1,
    },
    {
      name: "Tech",
      color: "bg-green-500",
      description: "Technologie et gadgets",
      order: 2,
    },
    {
      name: "Artisanat",
      color: "bg-pink-500",
      description: "Créations artisanales et DIY",
      order: 3,
    },
    {
      name: "Voyage",
      color: "bg-primary",
      description: "Voyages et destinations",
      order: 4,
    },
    {
      name: "Cosmétique",
      color: "bg-purple-500",
      description: "Beauté et cosmétiques",
      order: 5,
    },
    {
      name: "Revente",
      color: "bg-yellow-500",
      description: "Vente et revente d'articles",
      order: 6,
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log("✅ Categories created successfully");

  // Créer un utilisateur admin par défaut pour les badges par défaut
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@collective-club.com" },
    update: {},
    create: {
      email: "admin@collective-club.com",
      name: "Admin",
      role: "ADMIN",
      shopDomain: "collective-club-admin.myshopify.com",
    },
  });

  // Créer les badges par défaut
  const defaultBadges = [
    {
      name: "Nouveau",
      imageUrl: "/Badge-nouveau.svg",
      requiredCount: 5,
      isDefault: true,
      order: 1,
    },
    {
      name: "Bronze",
      imageUrl: "/Badge-bronze.svg",
      requiredCount: 50,
      isDefault: true,
      order: 2,
    },
    {
      name: "Argent",
      imageUrl: "/Badge-argent.svg",
      requiredCount: 100,
      isDefault: true,
      order: 3,
    },
    {
      name: "Or",
      imageUrl: "/Badge-or.svg",
      requiredCount: 500,
      isDefault: true,
      order: 4,
    },
  ];

  for (const badge of defaultBadges) {
    await prisma.badge.upsert({
      where: {
        userId_name: {
          userId: adminUser.id,
          name: badge.name,
        },
      },
      update: {},
      create: {
        ...badge,
        userId: adminUser.id,
      },
    });
  }

  console.log("✅ Default badges created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
