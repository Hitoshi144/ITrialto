import { IsNotEmpty } from "class-validator";

export class CreateTeamDto {
    @IsNotEmpty({message: 'Укажите название команды'})
    title: string

    description: string

    teamLeaderId: number
}
