import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { PrismaService } from './database/prisma.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // CORS configuration
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })

  // Prisma shutdown hooks
  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)

  const port = process.env.PORT || 3001
  await app.listen(port)
  
  console.log(`🚀 Server running on http://localhost:${port}`)
}

bootstrap().catch((error) => {
  console.error('❌ Error starting server:', error)
  process.exit(1)
})
