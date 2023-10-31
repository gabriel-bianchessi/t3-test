import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

const languages = [
  {
    name: 'Português'
  },
  {
    name: 'English'
  }
]

async function main() {
  try {
    for (const lang of languages) {
      await prisma.language.upsert({
        where: {
          name: lang.name
        },
        update: {},
        create: {
          name: lang.name
        }
      })
    }
  } catch(error) {
    console.error('Erro ao inserir áreas de conhecimento:', error);
  } finally {
    await prisma.$disconnect()
  }
}

void main()