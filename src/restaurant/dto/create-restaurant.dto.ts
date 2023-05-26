import { IsDate, IsEmail, IsInt, IsNotEmpty, IsPhoneNumber, Max, Min } from "class-validator";

export class CreateRestaurantDto {
   

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    address: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    opentime: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    endtime: string;
   

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    userid: number;




}
