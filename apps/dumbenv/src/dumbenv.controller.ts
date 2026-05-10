import { Controller, Get } from '@nestjs/common';
import { DumbenvService } from './dumbenv.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class DumbenvController {
  constructor(private readonly dumbenvService: DumbenvService) {}

  @Get()
  getHello(): string {
    return this.dumbenvService.getHello();
  }

  @MessagePattern({ cmd: 'test' })
  async test(@Payload() data: any) {
    return { valid: true, data };
  }
}
