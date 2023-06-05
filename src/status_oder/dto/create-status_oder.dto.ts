import { IsNotEmpty } from "class-validator";

export class CreateStatusOderDto {

    @IsNotEmpty({ message: 'Vui lòng không để trống tên' })
    name: string;


    @IsNotEmpty({ message: 'Vui lòng không để trống role' })
    role: string;

   

}
