import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'testuser@liquidbroker.com';
  const password = 'Test1234!';
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      email,
      passwordHash,
      firstName: 'Alex',
      lastName: 'Trader',
      role: 'USER',
      status: 'ACTIVE',
      country: 'United Kingdom',
      phone: '+44 7700 900123',
      walletBalance: 0,
    },
  });

  console.log('\n✅ Test user created/updated:');
  console.log(`   Email   : ${user.email}`);
  console.log(`   Password: ${password}`);
  console.log(`   Name    : ${user.firstName} ${user.lastName}`);
  console.log(`   Role    : ${user.role}`);
  console.log(`   Wallet  : $${user.walletBalance}`);
  console.log('\n📋 Login at http://localhost:5173/login\n');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
