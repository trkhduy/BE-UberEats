import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    name: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    address: string;


    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    password: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    @IsPhoneNumber('VN', {
        message: "Số điện thoại chưa đúng định dạng"
    })
    phone: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    @IsEmail()
    email: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    avatar: string;

    @IsNotEmpty()
    role: number;
}
