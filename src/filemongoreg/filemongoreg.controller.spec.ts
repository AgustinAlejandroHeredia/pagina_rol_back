import { Test, TestingModule } from '@nestjs/testing';
import { FilemongoregController } from './filemongoreg.controller';

describe('FilemongoregController', () => {
  let controller: FilemongoregController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilemongoregController],
    }).compile();

    controller = module.get<FilemongoregController>(FilemongoregController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
