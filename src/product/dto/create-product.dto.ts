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
    slug: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })

    description: string;
    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    userid: number;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    categoryid: number;


    images: string;

}
