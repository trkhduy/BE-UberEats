import { IsNotEmpty } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    name: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    price: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    sale_price: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    status: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    categoryid: number;

    slug: string;

    description: string;

    userid: number;

    images: string;

}
