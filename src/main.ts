import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const port = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  await app.listen(port, () => {
    logger.log(`Server started on http://localhost:${port}`, 'Bootstrap');
  });
}
bootstrap();
