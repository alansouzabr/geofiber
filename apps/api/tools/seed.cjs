const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const companyName = process.env.SEED_COMPANY_NAME || "GeoFiber Telecom";
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@geofiber.local";
  const adminPass = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";
  const adminName = process.env.SEED_ADMIN_NAME || "Admin GeoFiber";
  const cnpj = process.env.SEED_COMPANY_CNPJ || "00000000000100";

  const company = await prisma.company.upsert({
    where: { cnpj },
    update: { name: companyName },
    create: { name: companyName, cnpj },
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
  console.log({
    company: { id: company.id, name: company.name, cnpj: company.cnpj },
    user: { id: user.id, email: user.email, name: user.name, companyId: user.companyId },
    adminPass,
  });
}

main()
  .catch((e) => {
    console.error("Seed ERROR:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
