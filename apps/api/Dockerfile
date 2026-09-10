FROM node:20-alpine AS development

WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./
COPY prisma ./prisma/

# Usar npm install em vez de npm ci (já que não temos lock file)
RUN npm install

# Copiar código fonte
COPY . .

# Gerar cliente Prisma
RUN npx prisma generate

EXPOSE 3000 9229

CMD ["npm", "run", "start:dev"]

# Estágio de produção
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=development /app/dist ./dist
COPY --from=development /app/prisma ./prisma
RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
