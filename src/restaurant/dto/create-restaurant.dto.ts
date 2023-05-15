import { IsDate, IsEmail, IsInt, IsNotEmpty, IsPhoneNumber, Max, Min } from "class-validator";

export class CreateRestaurantDto {
    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    name: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    address: string;


    @IsNotEmpty({ message: "vui lòng không để trống" })
    @IsEmail({}, { message: "Email chưa đúng định dạng" })
    email: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    @IsPhoneNumber('VN', {
        message: "Số điện thoại chưa đúng định dạng"
    })
    phone: string;




}
