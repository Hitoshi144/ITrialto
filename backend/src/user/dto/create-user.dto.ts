import { Contains, IsNotEmpty, Min, MinLength } from "class-validator"

export class CreateUserDto {
    @Contains('tyuiu.ru', {message: 'Необходимо использовать электронную почту ТИУ'})
    mail: string

    @IsNotEmpty({message: 'Пожалуйста, укажите своё имя'})
    firstname: string

    @IsNotEmpty({message: 'Пожалуйста, укажите свою фамилию'})
    lastname: string

    @MinLength(6, {message: 'Длина пароля должна быть не менее 6 символов'})
    password: string
}
