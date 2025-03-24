import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'test@example.com';
  const plainPassword = '123456';

  // Verifica si el usuario ya existe
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log(`ℹ️ El usuario ${email} ya existe. No se inserta duplicado.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  console.log(`✅ Usuario creado: ${user.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Error al ejecutar seed:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });

