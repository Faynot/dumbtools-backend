import {
  Controller,
  Post,
  Body,
  Get,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'Gateway is running';
  }

  @Post('parse')
  @UseInterceptors(FileInterceptor('file'))
  async parse(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Res() res: Response,
  ) {
    if (!file) {
      return res.status(400).json({ error: 'config not be load' });
    }

    const fileContent = file.buffer.toString();

    const response = await this.appService.parse(body, fileContent);
    const resultString = response.result;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="config.kdl"');

    return res.send(resultString);
  }

  @Post('dumbenv')
  async dumbenv(@Body() body: any) {
    return this.appService.dumbenv(body);
  }
}
