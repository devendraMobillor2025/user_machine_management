import { PartialType } from '@nestjs/mapped-types';
import { CreateMachineUserMapDto } from './create-machine-user-map.dto';

export class UpdateMachineUserMapDto extends PartialType(CreateMachineUserMapDto) {
  machineAndUserMapId: number;

}
