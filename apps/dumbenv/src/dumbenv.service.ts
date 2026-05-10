import { Injectable } from '@nestjs/common';

@Injectable()
export class DumbenvService {
  getHello(): string {
    return 'Hello World!';
  }
}
