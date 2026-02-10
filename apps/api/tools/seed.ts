import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const companyName = process.env.SEED_COMPANY_NAME || "GeoFiber Telecom";
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@geofiber.local";
  const adminPass = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";
  const adminName = process.env.SEED_ADMIN_NAME || "Admin GeoFiber";

  const company = await prisma.company.upsert({
    where: { cnpj: "00000000000100" },
    update: { name: companyName },
    create: { name: companyName, cnpj: "00000000000100" },
  });

  const passwordHash = await bcrypt.hash(adminPass, 10);

  const user = await prisma.user.upsert({
    where: { companyId_email: { companyId: company.id, email: adminEmail } },
    update: { name: adminName, passwordHash, isActive: true },
    create: {
      companyId: company.id,
      email: adminEmail,
      name: adminName,
      passwordHash,
      isActive: true,
    },
  });

  console.log("Seed OK:");
  console.log({ company, user, adminPass });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
