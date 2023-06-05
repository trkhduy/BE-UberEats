import { IsNotEmpty } from "class-validator";

export class CreateVoucherDto {
    @IsNotEmpty({ message: 'Vui lòng không để trống tên' })
    name: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống discount' })
    discount: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống conditions' })
    conditions: number;

    // @IsNotEmpty({ message: 'Vui lòng không để trống code' })
    code: string;

    quantity: number;

    images: string;

    userid: number;

}
