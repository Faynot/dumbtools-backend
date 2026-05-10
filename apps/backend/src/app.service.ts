import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject('PARSER_SERVICE') private readonly parserClient: ClientProxy,
    @Inject('DUMBENV_SERVICE') private readonly dumbenvClient: ClientProxy,
  ) {}

  async parse(data: any) {
    return firstValueFrom(this.parserClient.send({ cmd: 'parse' }, data));
  }

  async dumbenv(data: any) {
    return firstValueFrom(this.dumbenvClient.send({ cmd: 'test' }, data));
  }
}
