const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.resolve(__dirname, 'prisma/dev.db');
const adapter = new PrismaBetterSqlite3(new Database(dbPath));
const prisma = new PrismaClient({ adapter });

async function makeAdmin() {
  await prisma.user.updateMany({
    where: { email: 'test@liquidbroker.com' },
    data: { role: 'ADMIN' }
  });
  console.log("Made user ADMIN");
}
makeAdmin();
