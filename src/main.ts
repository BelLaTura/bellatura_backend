import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import setupPipe from './middleware/pipe.middleware';
import { setupSwagger } from './middleware/swagger.middleware';
import setupTypeormFilter from './middleware/typeorm.middleware';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    const GLOBAL_PREFIX = 'api';
    const PORT = 1234;

    app.enableCors();
    setupTypeormFilter(app);
    setupPipe(app);

    setupSwagger(app, GLOBAL_PREFIX);

    await app.listen(PORT, function () {
      console.log(`http://localhost:${PORT}`);
      console.log(`http://localhost:${PORT}/${GLOBAL_PREFIX}/swagger`);
    });
  } catch (exception) {
    console.log('Error:', exception);
  }
}
bootstrap();
