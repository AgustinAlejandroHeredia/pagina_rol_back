import { Test, TestingModule } from '@nestjs/testing';
import { MapelemController } from './mapelem.controller';

describe('MapelemController', () => {
  let controller: MapelemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MapelemController],
    }).compile();

    controller = module.get<MapelemController>(MapelemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
