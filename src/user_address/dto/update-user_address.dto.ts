import { PartialType } from '@nestjs/mapped-types';
import { CreateUserAddressDto } from './create-user_address.dto';
import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class UpdateUserAddressDto extends PartialType(CreateUserAddressDto) {
    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    name_address: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    note: string;


    @IsNotEmpty({ message: "vui lòng không để trống" })

    location: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    @IsPhoneNumber('VN', {
        message: "Số điện thoại chưa đúng định dạng"
    })
    phone: string;
}
