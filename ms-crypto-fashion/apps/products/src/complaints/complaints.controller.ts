import { Body, Controller, Get, Logger, Param, Patch, Post, Query } from "@nestjs/common";
import { ComplaintsService } from "./complaints.service";
import { Public, Roles } from "@app/common/decorators";
import { RoleFormat } from "@app/common/enums";
import { CreateComplaintDto } from "./dto/create-complaint.dto";
import { UpdateStatusDto } from "./dto/update-complaint.dto";

@Controller('complaints')
export class ComplaintsController {
    private readonly logger = new Logger(ComplaintsController.name)
    constructor(private readonly complaintsService: ComplaintsService){}

    // @Roles(RoleFormat.USER)
  @Public()
  @Post()
  create(@Body() createComplaintDto: CreateComplaintDto) {
    return this.complaintsService.create(createComplaintDto);
  }



  @Roles(RoleFormat.ADMIN)
  @Get()
  getComplaintAll(@Query('per_page') perPage: number, @Query('page') page: number) {
    return this.complaintsService.findAll(perPage, page)
  }

  @Roles(RoleFormat.ADMIN)
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.complaintsService.findOne(id);
  }

  @Roles(RoleFormat.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComplaintDto: UpdateStatusDto) {
    return this.complaintsService.update(id, updateComplaintDto);
  }
}