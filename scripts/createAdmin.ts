import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'admin@rsfood84.fr';
  const password = 'Admin2026!';

  const hash = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: { password: hash },
    create: { email, password: hash },
  });

  console.log('✅ Admin créé/mis à jour :', admin.email);
  console.log('   Email :', email);
  console.log('   Mot de passe :', password);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
