import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@prisma.io',
  },
  {
    name: 'Nilu',
    email: 'nilu@prisma.io',
  },
  {
    name: 'Mahmoud',
    email: 'mahmoud@prisma.io',
  },
];
const categoryData: Prisma.CategoryCreateInput[] = [
  {
    name: 'pakaian',
    image:
      'https://asset.kompas.com/crops/M2s8l72RjkX26YXlGFT9qsx57Nw=/0x0:3000x2000/750x500/data/photo/2021/11/15/6191b3be47806.jpg',
  },
];
async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  for (const u of categoryData) {
    const user = await prisma.category.create({
      data: u,
    });
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
