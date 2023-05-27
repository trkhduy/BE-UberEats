import { IsDate, IsEmail, IsInt, IsNotEmpty, IsPhoneNumber, Max, Min } from "class-validator";

export class CreateRestaurantDto {

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    address: string;

    opentime: string;

    endtime: string;

    userid: number;
}
