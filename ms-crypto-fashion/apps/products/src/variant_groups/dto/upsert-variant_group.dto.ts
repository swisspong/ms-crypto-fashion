import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type, Transform } from "class-transformer"
import { IsArray, ValidateNested, IsString, IsNotEmpty, Length, ArrayNotEmpty, IsOptional, IsNumber, Min, IsInt } from "class-validator"



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

class UpsertVariantDto {
    @ApiPropertyOptional()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(3)

    vrnt_id: string;
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
    @IsInt()
    @Min(0)
    stock: number;

}



class UpsertOptionDto {
    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)

    @IsString()
    @IsNotEmpty()
    @Length(3)

    optn_id: string;
    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(3)
    name: string
}
class UpsertGroupDto {
    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(3)

    vgrp_id: string;

    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(3)
    name: string

    @ApiProperty({ isArray: true, type: UpsertOptionDto })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => UpsertOptionDto)
    options: UpsertOptionDto[]
}
export class UpsertVariantGroupDto {
    @ApiProperty({ isArray: true, type: UpsertGroupDto })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => UpsertGroupDto)
    groups: UpsertGroupDto[]

    @ApiProperty({ isArray: true, type: UpsertVariantDto })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => UpsertVariantDto)
    variants: UpsertVariantDto[]
}







