import { PartialType } from '@nestjs/mapped-types';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Max, Min, } from 'class-validator';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {

    address?: string;

    opentime?: string;

    endtime?: string;

    userid?: number;

}
