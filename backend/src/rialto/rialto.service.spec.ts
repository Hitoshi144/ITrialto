import { Test, TestingModule } from '@nestjs/testing';
import { RialtoService } from './rialto.service';

describe('RialtoService', () => {
  let service: RialtoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RialtoService],
    }).compile();

    service = module.get<RialtoService>(RialtoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
