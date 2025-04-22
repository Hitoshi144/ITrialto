import { IsNotEmpty } from "class-validator";

export class CreateRialtoDto {
    @IsNotEmpty({message: 'Введите название биржи'})
    title: string
}
