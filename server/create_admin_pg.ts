import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = "postgresql://neondb_owner:npg_7MU8BckPjaRI@ep-orange-hall-atktfsuo.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function main() {
  const pool = new Pool({ connectionString });
  
  try {
    const email = "admin@liquidglobalinvestments.com";
    const password = "SecureAdminPassword123!";
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Check if user exists
    const res = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);
    
    if (res.rows.length > 0) {
      await pool.query(
        'UPDATE "User" SET "role" = $1, "passwordHash" = $2 WHERE email = $3',
        ['ADMIN', passwordHash, email]
      );
      console.log("Admin updated successfully!");
    } else {
      // Create new user. We need to generate a UUID for the ID.
      const id = require('crypto').randomUUID();
      const now = new Date();
      await pool.query(
        'INSERT INTO "User" (id, email, "passwordHash", "firstName", "lastName", role, status, "walletBalance", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        [id, email, passwordHash, 'Super', 'Admin', 'ADMIN', 'ACTIVE', 0, now, now]
      );
      console.log("Admin created successfully!");
    }
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
