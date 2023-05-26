import { IsNotEmpty } from "class-validator";

export class CreateOrderdetailDto {
    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    quantity: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    productid: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    orderid: number;
}
