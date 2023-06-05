import { IsEmail, IsNotEmpty, IsPhoneNumber } from "class-validator";

export class CreateUserAddressDto {

    @IsNotEmpty({ message: 'Vui lòng không để trống tên' })
    name: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống địa chỉ' })
    name_address: string;

    note: string;


    @IsNotEmpty({ message: 'Vui lòng không để trống sdt' })
    @IsPhoneNumber('VN', {
        message: "Số điện thoại chưa đúng định dạng"
    })
    phone: string;

    location: string

    userid: number;
}
