import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DumbenvModule } from './dumbenv.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    DumbenvModule,
    {
      transport: Transport.TCP,
      options: { host: 'localhost', port: 3002 },
    },
  );
  await app.listen();
}
bootstrap();
