import { PartialType } from '@nestjs/mapped-types';
import { CreateStatusOderDto } from './create-status_oder.dto';

export class UpdateStatusOderDto extends PartialType(CreateStatusOderDto) {}
