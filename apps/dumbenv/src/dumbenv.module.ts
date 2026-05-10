import { Module } from '@nestjs/common';
import { DumbenvController } from './dumbenv.controller';
import { DumbenvService } from './dumbenv.service';

@Module({
  imports: [],
  controllers: [DumbenvController],
  providers: [DumbenvService],
})
export class DumbenvModule {}
