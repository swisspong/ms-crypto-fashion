import { ApiProperty } from "@nestjs/swagger"
import { Type, Transform } from "class-transformer"
import { IsArray, ValidateNested, IsString, IsNotEmpty, Length, ArrayNotEmpty } from "class-validator"

export class OptionDto {

    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(1)
    name: string
}
export class GroupDto {

    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(1)
    name: string

    @ApiProperty({ isArray: true, type: OptionDto })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => OptionDto)
    options: OptionDto[]
}
export class CreateVariantGroupDto {
    @ApiProperty({ isArray: true, type: GroupDto })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => GroupDto)
    groups: GroupDto[]
}
