import { Test, TestingModule } from '@nestjs/testing';
import { MachineUserMappingService } from './machine-user-mapping/machine-user-mapping.service';

describe('MachineUserMappingService', () => {
  let service: MachineUserMappingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MachineUserMappingService],
    }).compile();

    service = module.get<MachineUserMappingService>(MachineUserMappingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
