import { PartialType } from '@nestjs/mapped-types';
import { CreateRialtoDto } from './create-rialto.dto';

export class UpdateRialtoDto extends PartialType(CreateRialtoDto) {}
