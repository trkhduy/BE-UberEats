import { PartialType } from '@nestjs/mapped-types';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Max, Min, } from 'class-validator';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    address: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    opentime: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    endtime: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    userid: number;

}
