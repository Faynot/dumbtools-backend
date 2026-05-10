import { Controller, Get } from '@nestjs/common';
import { ParserService } from './parser.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ParseObject } from '@app/shared';

@Controller()
export class ParserController {
  constructor(private readonly parserService: ParserService) {}

  @MessagePattern({ cmd: 'parse' })
  async parse(
    @Payload()
    data: {
      type: 'niri' | 'hyprland';
      keys: string[];
      action: string;
      title?: string;
      entity?: string;
    },
  ) {
    const parser = new ParseObject(data.type, {
      keys: data.keys,
      action: data.action,
      title: data.title,
      entity: data.entity,
    });

    return { result: parser.parse() };
  }
}
