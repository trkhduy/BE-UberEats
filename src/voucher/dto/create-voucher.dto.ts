import { IsNotEmpty } from "class-validator";

export class CreateVoucherDto {
    @IsNotEmpty({ message: 'Vui lòng không để trống tên' })
    name: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống discount' })
    discount: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống conditions' })
    conditions: string;

    images: string;

    userid: number;

}
