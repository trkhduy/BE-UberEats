import { PartialType } from '@nestjs/mapped-types';
import { CreateVoucherDto } from './create-voucher.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateVoucherDto extends PartialType(CreateVoucherDto) {

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    name: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    discount: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    conditions: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    restaurantid: number;

    images: string;

}
