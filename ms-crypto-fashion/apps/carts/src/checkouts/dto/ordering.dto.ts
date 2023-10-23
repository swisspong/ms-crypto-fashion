import { ApiProperty } from "@nestjs/swagger"
import { PaymentMethodFormat } from "../schemas/checkout.schema"
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from "class-validator"
import { Transform } from "class-transformer"


export class OrderingDto {

    // @ApiProperty()
    // @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    // @IsOptional()
    // @IsString()
    // @IsNotEmpty()
    // @Length(3)
    // chkt_id: string


    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(3)
    address: string
    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(3)
    recipient: string

    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(3)
    post_code: string

    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(3)
    tel_number: string
    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @Length(3)
    token?: string

    @ApiProperty()
    @IsEnum(PaymentMethodFormat)
    payment_method: PaymentMethodFormat

}