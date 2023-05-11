import { IsNotEmpty } from "class-validator";

export class CreateVoucherDto {
    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    name: string;

    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    discount: number; 
    
    @IsNotEmpty({ message: 'Vui lòng không để trống' })
    conditions: string;
}
