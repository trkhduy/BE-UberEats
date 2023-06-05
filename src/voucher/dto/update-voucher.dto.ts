import { PartialType } from '@nestjs/mapped-types';
import { CreateVoucherDto } from './create-voucher.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateVoucherDto extends PartialType(CreateVoucherDto) {

    name: string;

    discount: number;

    conditions: number;

    userid: number;

    images: string;

    code: string;

    quantity: number;

}
