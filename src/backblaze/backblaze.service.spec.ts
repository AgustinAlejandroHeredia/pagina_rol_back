import { Test, TestingModule } from '@nestjs/testing';
import { BackblazeService } from './backblaze.service';

describe('BackblazeService', () => {
  let service: BackblazeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BackblazeService],
    }).compile();

    service = module.get<BackblazeService>(BackblazeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
