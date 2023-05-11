import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    address: string;


    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    phone: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    avatar: string;

    @IsNotEmpty()
    role: number;
}
