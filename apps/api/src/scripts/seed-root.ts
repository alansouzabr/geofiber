import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

async function main() {
  const prisma = new PrismaClient();

  const email = process.env.ROOT_EMAIL || 'root@geofiber.local';
  const password = process.env.ROOT_PASSWORD || 'ChangeMe123!';
  const name = process.env.ROOT_NAME || 'Root Admin';

  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findFirst({ where: { email } });

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { name, passwordHash, isActive: true, companyId: null },
    });
    console.log('ROOT user atualizado:', email);
  } else {
    await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        isActive: true,
        companyId: null,
      },
    });
    console.log('ROOT user criado:', email);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
