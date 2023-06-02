import { IsNotEmpty } from "class-validator";

export class CreateOderDto {
    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    restaurantid: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    statusid: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    userAddressid: number;

    userid: number;

    note: string;

    driverid: number;
}
