import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API Pagina Rol')
    .setDescription('Documentacion para la API de rol')
    .setVersion('1.0')
    .build()

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
