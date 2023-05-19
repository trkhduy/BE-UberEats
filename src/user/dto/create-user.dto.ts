import { IsEmail, IsNotEmpty, IsPhoneNumber } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({ message: 'Vui lòng không để trống tên' })
    name: string;


    @IsNotEmpty({ message: 'Vui lòng không để trống mật khẩu' })
    password: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống số điện thoại' })
    @IsPhoneNumber('VN', {
        message: "Số điện thoại chưa đúng định dạng"
    })
    phone: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống email' })
    @IsEmail({}, { message: "Email chưa đúng định dạng" })
    email: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống role' })
    role: number;
}

