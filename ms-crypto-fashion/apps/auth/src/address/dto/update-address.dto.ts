import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IAddressDto } from './address.dto';


export class UpdateAddressDto extends PartialType(IAddressDto) {}

