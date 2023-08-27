import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateComplaintDto } from './create-complaint.dto';
import { StatusFormat } from '../schemas/complaints.schema';
import { IsEnum, IsString } from 'class-validator';

export class UpdateComplaintDto extends PartialType(CreateComplaintDto) {}

export class UpdateStatusDto {
    @ApiProperty()
    @IsEnum(StatusFormat)
    status: StatusFormat;
}