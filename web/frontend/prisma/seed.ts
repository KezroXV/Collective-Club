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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
