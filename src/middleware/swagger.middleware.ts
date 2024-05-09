import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const SwaggerConfig = new DocumentBuilder()
  .setTitle('REST API документация')
  .setDescription(
    '' +
      'Эндпоинты: \n\n' +
      '- [/api/v1/users](#/api_v1_users) - регистрация, подтверждение аккаунта, забыли пароль, смена пароля, смена e-mail, отмена смены e-mail \n\n' +
      '- [/api/v1/sessions](#/api_v1_sessions) - работа с сессиями \n\n' +
      '',
  )
  .setVersion('1.0.0')
  .addTag('api_v1_users', 'Регистрация')
  .addTag('api_v1_sessions', 'Работа с сессиями')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'access token - токен доступа',
      in: 'header',
    },
    'access-token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
  )
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'refresh token - токен обновления',
      in: 'header',
    },
    'refresh-token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
  )
  .build();

export function setupSwagger(app: INestApplication, GLOBAL_PREFIX: string) {
  const document = SwaggerModule.createDocument(app, SwaggerConfig);

  app.use(`${GLOBAL_PREFIX}/swagger.json`, (req, res) => {
    res.json(document);
  });

  SwaggerModule.setup(`${GLOBAL_PREFIX}/swagger`, app, document);
}
