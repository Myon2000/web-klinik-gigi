import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');

  // Create or update default Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
    },
  });
  console.log(`Admin ready: ${admin.username} (Password: admin123)`);

  // Create or update default ClinicSetting
  const setting = await prisma.clinicSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      isOpen: true,
      announcement: 'Selamat datang di Klinik Gigi. Silakan daftar untuk konsultasi keluhan gigi Anda.',
    },
  });
  console.log(`Clinic settings initialized: isOpen=${setting.isOpen}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
