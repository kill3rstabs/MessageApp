import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as session from 'express-session';
import * as passport from 'passport';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule,DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Messages example')
    .setDescription('The Message API description')
    .setVersion('1.0')
    .addTag('messages')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe(
    {whitelist: true,forbidNonWhitelisted:true}
  ));
  app.setBaseViewsDir(path.join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false,
  }))
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3000);
}
bootstrap();