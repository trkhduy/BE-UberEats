import { IsNotEmpty } from "class-validator";

export class CreateOderDto {
    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    restaurantid: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    statusOderid: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    userAddressid: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    userid: number;

    note: string;
    
    driverid: number;






}
