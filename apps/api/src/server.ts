import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';

async function bootstrap() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });

  app.get('/health', async () => ({
    ok: true,
    name: 'geofiber-api'
  }));

  
  const { polesRoutes } = await import('./routes/poles');
  await app.register(polesRoutes);


  const port = Number(process.env.PORT || 3333);
  const host = '0.0.0.0';

  await app.listen({ port, host });

  console.log(`🚀 API rodando em http://localhost:${port}`);
}

bootstrap();
