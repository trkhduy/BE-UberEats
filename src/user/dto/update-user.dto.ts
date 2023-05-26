import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    name: string;

    @IsPhoneNumber('VN', {
        message: "Số điện thoại chưa đúng định dạng"
    })
    phone: string;

    @IsEmail()
    email: string;

    avatar: string;

}
