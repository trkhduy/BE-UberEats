import { PartialType } from '@nestjs/mapped-types';
import { CreateUserAddressDto } from './create-user_address.dto';
import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class UpdateUserAddressDto extends PartialType(CreateUserAddressDto) {

    name: string;

    name_address: string;

    note: string;

    location: string;

    @IsPhoneNumber('VN', {
        message: "Số điện thoại chưa đúng định dạng"
    })
    phone: string;

    userid: number;
}
