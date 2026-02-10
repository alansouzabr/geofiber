const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const company = await prisma.company.findFirst({
    orderBy: { createdAt: 'asc' },
  });
  if (!company) throw new Error('Nenhuma company encontrada');

  const companyId = company.id;

  const roles = [
    { name: 'ADMIN' },
    { name: 'PROJETISTA' },
    { name: 'TECNICO_CAMPO' },
    { name: 'NOC' },
    { name: 'SUPORTE_INTERNO' },
    { name: 'LANÇADOR_FIBRA' },
    { name: 'VENDAS' },
  ];

  const permissions = [
    // Mapas
    { key: 'MAP:READ', description: 'Ver mapas e camadas' },
    { key: 'MAP:EDIT', description: 'Editar mapas e camadas' },

    // Ativos de rede (postes, CTO, CEO, caixas, splitters, dutos, cabos, etc.)
    { key: 'ASSET:READ', description: 'Ver ativos de rede' },
    { key: 'ASSET:CREATE', description: 'Criar ativos de rede' },
    { key: 'ASSET:UPDATE', description: 'Atualizar ativos de rede' },

    // Ordens de serviço
    { key: 'WORKORDER:READ', description: 'Ver ordens de serviço' },
    { key: 'WORKORDER:UPDATE', description: 'Atualizar ordens de serviço' },

    // Clientes
    { key: 'CUSTOMER:READ', description: 'Ver clientes' },
    { key: 'CUSTOMER:CREATE', description: 'Criar clientes' },

    // Integrações (SGP/IXC etc.)
    { key: 'INTEGRATION:READ', description: 'Ver integrações (SGP/IXC)' },
    { key: 'INTEGRATION:EDIT', description: 'Editar integrações (SGP/IXC)' },

    // Perfil Técnico de Campo (CBO: 3133-10 / 3133-15 / 3133-20)
    { key: 'TECH:PROFILE:READ', description: 'Ler perfil do técnico' },
    { key: 'TECH:PROFILE:WRITE', description: 'Criar/editar perfil do técnico' },
    { key: 'TECH:PROFILE:LIST', description: 'Listar técnicos da empresa' },
  ];

  // 1) Roles
  for (const r of roles) {
    await prisma.role.upsert({
      where: { companyId_name: { companyId, name: r.name } },
      update: {},
      create: { companyId, name: r.name },
    });
  }

  // 2) Permissions (multi-tenant)
  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { companyId_key: { companyId, key: p.key } },
      update: { description: p.description },
      create: { companyId, key: p.key, description: p.description },
    });
  }

  // 3) Role → Permissions mapping
  const rolePerms = {
    ADMIN: permissions.map((p) => p.key),

    PROJETISTA: [
      'MAP:READ', 'MAP:EDIT',
      'ASSET:READ', 'ASSET:CREATE', 'ASSET:UPDATE',
      'INTEGRATION:READ',
    ],

    TECNICO_CAMPO: [
      'MAP:READ',
      'ASSET:READ',
      'WORKORDER:READ', 'WORKORDER:UPDATE',
      'TECH:PROFILE:READ', 'TECH:PROFILE:WRITE',
    ],

    NOC: [
      'MAP:READ',
      'ASSET:READ',
      'WORKORDER:READ', 'WORKORDER:UPDATE',
      'INTEGRATION:READ',
      'TECH:PROFILE:READ', 'TECH:PROFILE:LIST',
    ],

    SUPORTE_INTERNO: [
      'CUSTOMER:READ',
      'WORKORDER:READ', 'WORKORDER:UPDATE',
      'TECH:PROFILE:READ',
    ],

    LANÇADOR_FIBRA: [
      'MAP:READ',
      'ASSET:READ', 'ASSET:CREATE', 'ASSET:UPDATE',
      'TECH:PROFILE:READ',
    ],

    VENDAS: [
      'CUSTOMER:READ', 'CUSTOMER:CREATE',
      'MAP:READ',
    ],
  };

  const dbRoles = await prisma.role.findMany({ where: { companyId } });
  const dbPerms = await prisma.permission.findMany({ where: { companyId } });

  const roleByName = Object.fromEntries(dbRoles.map((r) => [r.name, r]));
  const permByKey = Object.fromEntries(dbPerms.map((p) => [p.key, p]));

  for (const [roleName, keys] of Object.entries(rolePerms)) {
    const role = roleByName[roleName];
    if (!role) throw new Error(`Role não encontrada no banco: ${roleName}`);

    for (const key of keys) {
      const perm = permByKey[key];
      if (!perm) throw new Error(`Permissão não encontrada no banco: ${key}`);

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: perm.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: perm.id,
        },
      });
    }
  }

  console.log('RBAC seed OK for company:', companyId);
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error('RBAC seed ERROR:', e);
  try { await prisma.$disconnect(); } catch {}
  process.exit(1);
});
