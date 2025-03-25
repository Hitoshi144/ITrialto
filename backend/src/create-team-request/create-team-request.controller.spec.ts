import { Test, TestingModule } from '@nestjs/testing';
import { CreateTeamRequestController } from './create-team-request.controller';
import { CreateTeamRequestService } from './create-team-request.service';

describe('CreateTeamRequestController', () => {
  let controller: CreateTeamRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateTeamRequestController],
      providers: [CreateTeamRequestService],
    }).compile();

    controller = module.get<CreateTeamRequestController>(CreateTeamRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
