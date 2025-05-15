import { Test, TestingModule } from '@nestjs/testing';
import { MachineUserMappingController } from './machine-user-mapping.controller';

describe('MachineUserMappingController', () => {
  let controller: MachineUserMappingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MachineUserMappingController],
    }).compile();

    controller = module.get<MachineUserMappingController>(MachineUserMappingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
