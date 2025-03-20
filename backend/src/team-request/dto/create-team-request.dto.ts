import { IsNotEmpty } from "class-validator";

export class CreateTeamRequestDto {
    @IsNotEmpty({message: 'Не указан id команды'})
    teamId: number

    @IsNotEmpty({message: 'Не указан id пользователя'})
    userId: number
}
