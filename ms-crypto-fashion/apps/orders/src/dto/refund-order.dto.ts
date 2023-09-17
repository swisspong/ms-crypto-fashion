import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class RefundOrderDto {

    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(3)
    order_id: string


}