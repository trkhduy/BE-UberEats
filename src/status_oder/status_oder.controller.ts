import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StatusOderService } from './status_oder.service';
import { CreateStatusOderDto } from './dto/create-status_oder.dto';
import { UpdateStatusOderDto } from './dto/update-status_oder.dto';

@Controller('api/status-oder')
export class StatusOderController {
  constructor(private readonly statusOderService: StatusOderService) { }

  @Post()
  async create(@Body() createStatusOderDto: CreateStatusOderDto) {
    const status = await this.statusOderService.create(createStatusOderDto)
    return {
      statuscode: 200,
      message: "thêm mới tài khoản thành công",
      result: status

    }
  }


  @Get()
  findAll() {
    return this.statusOderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statusOderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStatusOderDto: UpdateStatusOderDto) {
    return this.statusOderService.update(+id, updateStatusOderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statusOderService.remove(+id);
  }
}
