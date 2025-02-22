import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API used for testing purpose')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: process.env.DOMEN_NAME ? ['http://' + process.env.DOMEN_NAME, 'https://' + process.env.DOMEN_NAME] : '*',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
// https://oauth.yandex.ru/authorize?response_type=token&client_id=14e2cce0ee3743fe8f1e0da062f95200
