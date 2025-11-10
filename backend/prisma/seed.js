require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function run() {
  const prisma = new PrismaClient();
  try {
    const seedPath = path.join(__dirname, 'seed.sql');
    if (!fs.existsSync(seedPath)) {
      console.error('seed.sql not found at', seedPath);
      process.exit(1);
    }

    const sql = fs.readFileSync(seedPath, 'utf8');

    // Split statements by semicolon followed by a line break. This is a simple parser
    // suitable for our controlled seed.sql. Avoids executing empty statements.
    const statements = sql
      .split(/;\s*\n/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const stmt of statements) {
      try {
        // Use $executeRawUnsafe because statements may contain identifiers and literals
        await prisma.$executeRawUnsafe(stmt);
      } catch (e) {
        // Log and continue for statements like SELECT that may return rows
        console.error('Error executing statement:', stmt.slice(0, 200));
        console.error(e.message || e);
      }
    }

    console.log('Database seeding completed.');
  } finally {
    await prisma.$disconnect();
  }
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
