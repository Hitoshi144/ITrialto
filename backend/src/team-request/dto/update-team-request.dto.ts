import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamRequestDto } from './create-team-request.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateTeamRequestDto extends PartialType(CreateTeamRequestDto) {
    @IsNotEmpty({message: 'Не указан ответ на запрос в команду'})
    status: 'approved' | 'rejected'
}
