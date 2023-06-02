import { PartialType } from '@nestjs/mapped-types';
import { CreateOderDto } from './create-oder.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateOderDto extends PartialType(CreateOderDto) {
    @IsNotEmpty({ message: 'Vui lòng không để trống ghi chú' })
    note: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống nhà hàng' })
    restaurantid: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống trạng thái' })
    statusOderid: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống địa chỉ' })
    userAddressid: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống ng dùng' })
    userid: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống tài xế' })
    driverid: number;

}
