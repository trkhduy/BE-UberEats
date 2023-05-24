import { PartialType } from '@nestjs/mapped-types';
import { CreateOderDto } from './create-oder.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateOderDto extends PartialType(CreateOderDto) {
    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    note: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    restaurantid: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    statusOderid: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    userAddressid: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    userid: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    driverid: number;

}
