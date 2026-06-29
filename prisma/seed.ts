import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  // Create default admin user
  const passwordHash = crypto
    .createHash('sha256')
    .update('admin123!') // Change this in production
    .digest('hex');

  await prisma.adminUser.upsert({
    where: { email: 'support@mountmove.org' },
    update: {},
    create: {
      email: 'support@mountmove.org',
      passwordHash,
      name: 'Admin User',
    },
  });

  console.log('✅ Seed complete: Admin user created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
