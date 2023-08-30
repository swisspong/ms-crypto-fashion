import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class IAddressDto {
    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(6)
    address: string

    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(4)
    post_code: string
    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(4)
    recipient: string

    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(9)
    tel_number: string

}