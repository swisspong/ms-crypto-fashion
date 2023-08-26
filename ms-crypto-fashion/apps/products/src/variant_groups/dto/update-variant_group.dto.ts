import { ApiProperty } from "@nestjs/swagger"
import { Type, Transform } from "class-transformer"
import { IsArray, ValidateNested, IsString, IsNotEmpty, Length, ArrayNotEmpty, IsOptional } from "class-validator"



class EditOptionDto {
    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(3)
    optn_id?: string;
    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(3)
    name: string
}
class EditGroupDto {
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

    @ApiProperty({ isArray: true, type: EditOptionDto })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => EditOptionDto)
    options: EditOptionDto[]
}
export class UpdateVariantGroupDto {
    @ApiProperty({ isArray: true, type: EditGroupDto })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => EditGroupDto)
    groups: EditGroupDto[]
}