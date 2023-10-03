import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString, Length, Min, ValidateNested } from "class-validator";


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
export class AddVariantDto {
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
    @ApiProperty()
    @IsNumber()
    @Min(0)
    stock: number;
    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(3)
    vrnt_id: string;
}