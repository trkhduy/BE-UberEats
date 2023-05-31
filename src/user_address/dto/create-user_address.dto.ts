import { IsEmail, IsNotEmpty, IsPhoneNumber } from "class-validator";

export class CreateUserAddressDto {

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    name_address: string;

    note: string;


    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    @IsPhoneNumber('VN', {
        message: "Số điện thoại chưa đúng định dạng"
    })
    phone: string;

    location: string

    userid: number;
}
