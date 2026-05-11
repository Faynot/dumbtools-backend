import {
  Controller,
  Post,
  Body,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'Gateway is running';
  }

  @Post('parse')
  @UseInterceptors(FileInterceptor('file'))
  async parse(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    console.log(file);
    return this.appService.parse(body);
  }

  @Post('dumbenv')
  async dumbenv(@Body() body: any) {
    return this.appService.dumbenv(body);
  }
}
