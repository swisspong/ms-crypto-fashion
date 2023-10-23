import { MerchantStatus } from "@app/common/enums";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString, Length } from "class-validator";
// import { MerchantStatus } from "../schemas/merchant.schema";

export class UpdateStatusDto {

    @ApiProperty()
    @IsEnum(MerchantStatus)
    status: MerchantStatus;

}