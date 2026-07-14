import { prisma } from './src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const email = "admin@liquidglobalinvestments.com";
  const password = "SecureAdminPassword123!";
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE'
    },
    create: {
      email,
      passwordHash,
      firstName: "Super",
      lastName: "Admin",
      role: 'ADMIN',
      status: 'ACTIVE'
    },
  });

  console.log("Admin created successfully:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
