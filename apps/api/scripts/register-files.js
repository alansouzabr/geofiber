const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const COMPANY_ID = 'a14fecc5-5743-4786-adeb-eb0af1c70bc8';

async function registerFiles() {
  const basePath = path.join(process.cwd(), 'uploads', 'companies', COMPANY_ID);
  
  async function walk(dir, relativePath = '') {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const full = path.join(dir, item);
      const stat = fs.statSync(full);
      
      if (stat.isDirectory()) {
        await walk(full, path.join(relativePath, item));
      } else {
        const fileUrl = `https://api.geofibers.com.br/uploads/companies/${COMPANY_ID}/${relativePath}/${item}`;
        
        // Extrair categoria do path
        const parts = relativePath.split('/');
        const [year, month, category] = parts;
        
        // Verificar se já existe
        const exists = await prisma.companyFile.findFirst({
          where: { companyId: COMPANY_ID, fileUrl }
        });
        
        if (!exists) {
          await prisma.companyFile.create({
            data: {
              companyId: COMPANY_ID,
              name: item,
              fileName: item,
              fileUrl,
              type: path.extname(item).substring(1),
              size: stat.size,
              uploadedBy: 'system_sync'
            }
          });
          console.log(`✅ Registrado: ${item} (${category}/${year}/${month})`);
        } else {
          console.log(`⏭️  Já existe: ${item}`);
        }
      }
    }
  }
  
  await walk(basePath);
  console.log('✅ Sincronização concluída!');
  await prisma.$disconnect();
}

registerFiles().catch(console.error);
