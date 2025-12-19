import { Test, TestingModule } from '@nestjs/testing';
import { MapelemService } from './mapelem.service';

describe('MapelemService', () => {
  let service: MapelemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MapelemService],
    }).compile();

    service = module.get<MapelemService>(MapelemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
