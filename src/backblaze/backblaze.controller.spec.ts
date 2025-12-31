import { Test, TestingModule } from '@nestjs/testing';
import { BackblazeController } from './backblaze.controller';

describe('BackblazeController', () => {
  let controller: BackblazeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BackblazeController],
    }).compile();

    controller = module.get<BackblazeController>(BackblazeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
