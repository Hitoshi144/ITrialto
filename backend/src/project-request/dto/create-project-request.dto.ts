import { IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class CreateProjectRequestDto {
    @IsInt()
    @IsNotEmpty()
    projectId: number;
  
    @IsInt()
    @IsNotEmpty()
    teamId: number;
}
