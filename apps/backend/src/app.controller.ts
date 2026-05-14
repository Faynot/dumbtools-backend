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

  @Post('genconf')
  @UseInterceptors(FileInterceptor('file'))
  async genconf(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Res() res: Response,
  ) {
    if (!file) {
      return res.status(400).json({ error: 'Config file not uploaded' });
    }

    const fileContent = file.buffer.toString();

    let keys = body.keys;
    if (typeof keys === 'string') {
      keys = keys.split(',').map((k) => k.trim());
    }

    const payload = {
      ...body,
      keys: keys,
    };

    try {
      const response = await this.appService.genconf(payload, fileContent);
      const resultString = response.result;

      const extension = body.type === 'niri' ? 'kdl' : 'conf';

      res.setHeader('Content-Type', 'text/plain');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="config.${extension}"`,
      );

      return res.send(resultString);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  @Post('dumbenv')
  async dumbenv(@Body() body: any) {
    return this.appService.dumbenv(body);
  }
}
