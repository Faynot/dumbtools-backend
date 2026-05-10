import { Test, TestingModule } from '@nestjs/testing';
import { DumbenvController } from './dumbenv.controller';
import { DumbenvService } from './dumbenv.service';

describe('DumbenvController', () => {
  let dumbenvController: DumbenvController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DumbenvController],
      providers: [DumbenvService],
    }).compile();

    dumbenvController = app.get<DumbenvController>(DumbenvController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(dumbenvController.getHello()).toBe('Hello World!');
    });
  });
});
