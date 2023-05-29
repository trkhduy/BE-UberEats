import { IsNotEmpty } from "class-validator";

export class CreateCategoryDto {

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    name: string;

    status: string;

    userid: number
}
