import { Test, TestingModule } from '@nestjs/testing';
import { RialtoController } from './rialto.controller';
import { RialtoService } from './rialto.service';

describe('RialtoController', () => {
  let controller: RialtoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RialtoController],
      providers: [RialtoService],
    }).compile();

    controller = module.get<RialtoController>(RialtoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
