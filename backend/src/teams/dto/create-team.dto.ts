import { IsNotEmpty } from "class-validator";

export class CreateTeamDto {
    @IsNotEmpty({message: 'Укажите название команды'})
    title: string

    @IsNotEmpty({message: 'Укажите описание команды'})
    description: string

    teamLeaderId: number
}
