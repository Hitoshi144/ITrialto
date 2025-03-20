import { Test, TestingModule } from '@nestjs/testing';
import { TeamRequestController } from './team-request.controller';
import { TeamRequestService } from './team-request.service';

describe('TeamRequestController', () => {
  let controller: TeamRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamRequestController],
      providers: [TeamRequestService],
    }).compile();

    controller = module.get<TeamRequestController>(TeamRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
