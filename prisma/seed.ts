import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const defaultCategories = [
  'Tired',
  'Distracted',
  'Poor planning',
  'Too ambitious',
  'Forgot',
  'Low motivation',
  'External obligation',
  'Other',
]

async function main() {
  console.log('Seeding default excuse categories...')
  
  for (const category of defaultCategories) {
    await prisma.excuseCategory.upsert({
      where: { name: category },
      update: {},
      create: { name: category },
    })
  }
  
  console.log('Seed completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
