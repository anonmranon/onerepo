import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, 'prisma/dev.db');
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter } as any);

async function makeAdmin() {
  await prisma.user.updateMany({
    where: { email: 'test@liquidbroker.com' },
    data: { role: 'ADMIN' }
  });
  console.log("Made user ADMIN");
}
makeAdmin();
