import { Controller, Post, Body, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'Gateway is running';
  }

  @Post('parse')
  async parse(@Body() body: any) {
    return this.appService.parse(body);
  }

  @Post('dumbenv')
  async dumbenv(@Body() body: any) {
    return this.appService.dumbenv(body);
  }
}
