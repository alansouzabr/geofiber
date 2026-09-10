import { PrismaClient } from '@prisma/client'
import { generateId } from '../src/common/utils/id'
import { COMPANY_ROLES } from '../src/modules/roles/roles.constants'

const prisma = new PrismaClient()

async function main() {

  const companies = await prisma.company.findMany({
    select: {
      id: true,
      name: true
    }
  })

  for (const company of companies) {

    console.log(`Empresa: ${company.name}`)

    for (const roleName of COMPANY_ROLES) {

      const exists = await prisma.role.findFirst({
        where: {
          companyId: company.id,
          name: roleName
        }
      })

      if (!exists) {

        await prisma.role.create({
          data: {
            id: generateId(),
            companyId: company.id,
            name: roleName
          }
        })

        console.log(`  + ${roleName}`)

      } else {

        console.log(`  = ${roleName}`)

      }

    }

  }

  await prisma.$disconnect()

}

main().catch(async e => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
