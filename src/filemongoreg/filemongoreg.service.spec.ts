import { Test, TestingModule } from '@nestjs/testing';
import { FilemongoregService } from './filemongoreg.service';

describe('FilemongoregService', () => {
  let service: FilemongoregService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilemongoregService],
    }).compile();

    service = module.get<FilemongoregService>(FilemongoregService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
