import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PARSER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.PARSER_HOST ?? 'localhost',
          port: Number(process.env.PARSER_PORT) ?? 3001,
        },
      },
      {
        name: 'DUMBENV_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.DUMBENV_HOST ?? 'localhost',
          port: Number(process.env.DUMBENV_PORT) ?? 3002,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
