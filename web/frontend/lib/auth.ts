import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function verifyAdminRole(userId: string): Promise<{ isAdmin: boolean; error?: string }> {
  try {
    if (!userId) {
      return { isAdmin: false, error: "userId is required" };
    }

    // Vérifier si l'utilisateur existe et est admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, email: true }
    });

    if (!user) {
      return { isAdmin: false, error: "User not found" };
    }

    if (user.role !== 'ADMIN') {
      return { isAdmin: false, error: "Admin privileges required" };
    }

    return { isAdmin: true };
  } catch (error) {
    console.error("Error verifying admin role:", error);
    return { isAdmin: false, error: "Authorization check failed" };
  }
}

export async function requireAdmin(userId: string) {
  const auth = await verifyAdminRole(userId);
  
  if (!auth.isAdmin) {
    throw new Error(auth.error || "Unauthorized");
  }
  
  return true;
}