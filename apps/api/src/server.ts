import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

const JWT_SECRET = "supersecret"

function auth(req: any, res: any, next: any) {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) return res.status(401).json({ error: 'No token' })

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// REGISTER
app.post('/register', async (req, res) => {
  const { email, password, companyName } = req.body

  const hash = await bcrypt.hash(password, 10)

  const company = await prisma.company.create({
    data: { name: companyName }
  })

  const user = await prisma.user.create({
    data: {
      email,
      password: hash,
      companyId: company.id
    }
  })

  const token = jwt.sign({
    userId: user.id,
    companyId: company.id
  }, JWT_SECRET)

  res.json({ token })
})

// TESTE
app.get('/', (req, res) => {
  res.send('API OK')
})

app.get('/projects', auth, async (req: any, res) => {
  res.json({ ok: true, companyId: req.User.CompanyId })
})

app.listen(3002, () => {
  console.log('🔥 API rodando na porta 3002')
})
