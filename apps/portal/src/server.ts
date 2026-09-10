import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()

app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}))

// 🔥 FIX EXPRESS
app.options('/*', (req, res) => {
  res.sendStatus(200)
})

app.use(express.json())

const JWT_SECRET = "supersecret"

// LOGIN
app.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findFirst({ where: { email } })
  if (!user) return res.json({ error: 'User not found' })

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return res.json({ error: 'Invalid password' })

  const token = jwt.sign({
    userId: user.id,
    companyId: user.companyId
  }, JWT_SECRET)

  res.json({ token })
})

// TESTE
app.get('/', (req, res) => {
  res.send('API OK')
})

app.listen(3002, '0.0.0.0', () => {
  console.log('🔥 EXPRESS API rodando na porta 3002')
})
