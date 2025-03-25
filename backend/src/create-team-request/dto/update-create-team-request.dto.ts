import { PartialType } from '@nestjs/mapped-types';
import { CreateCreateTeamRequestDto } from './create-create-team-request.dto';

export class UpdateCreateTeamRequestDto extends PartialType(CreateCreateTeamRequestDto) {}
