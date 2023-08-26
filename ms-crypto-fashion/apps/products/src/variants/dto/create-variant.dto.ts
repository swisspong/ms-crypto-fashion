import { ApiProperty } from "@nestjs/swagger"
import { Type ,Transform} from "class-transformer"
import { IsArray, ArrayNotEmpty, ValidateNested, IsNumber, Min,IsString,IsNotEmpty,Length } from "class-validator"

export class VariantSelectedDto {
    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(3)
    vgrp_id: string
    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(3)
    optn_id: string
}
export class VariantDto {
    @ApiProperty({ isArray: true, type: VariantSelectedDto })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => VariantSelectedDto)
    variant_selecteds: VariantSelectedDto[]

    @ApiProperty()
    @IsNumber()
    @Min(0)
    price: number;
}
export class CreateVariantDto {
    @ApiProperty({ isArray: true, type: VariantDto })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => VariantDto)
    variants: VariantDto[]

}
