import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function polesRoutes(app: any) {

  app.get('/poles', async (req: any) => {
    const { companyId } = req.query

    return prisma.pole.findMany({
      where: { companyId }
    })
  })

  app.post('/poles', async (req: any) => {
    const body = req.body

    return prisma.pole.create({
      data: body
    })
  })

  app.patch('/poles/:id', async (req: any) => {
    const { id } = req.params
    const { lat, lng } = req.body

    return prisma.pole.update({
      where: { id },
      data: { lat, lng }
    })
  })

  app.delete('/poles/:id', async (req: any) => {
    const { id } = req.params

    await prisma.pole.delete({ where: { id } })

    return { ok: true }
  })

}
