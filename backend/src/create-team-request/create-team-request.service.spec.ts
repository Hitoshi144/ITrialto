import { Test, TestingModule } from '@nestjs/testing';
import { CreateTeamRequestService } from './create-team-request.service';

describe('CreateTeamRequestService', () => {
  let service: CreateTeamRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateTeamRequestService],
    }).compile();

    service = module.get<CreateTeamRequestService>(CreateTeamRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
