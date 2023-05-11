import { IsEmail, IsNotEmpty, IsPhoneNumber } from "class-validator";

export class CreateUserDto {
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
    @IsEmail({}, { message: "Email chưa đúng định dạng" })
    email: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    role: number;
}

