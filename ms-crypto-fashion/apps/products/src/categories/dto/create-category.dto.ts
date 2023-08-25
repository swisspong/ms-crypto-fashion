import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class CreateCategoryDto {

    @ApiProperty({ example: "Jeans" })
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(3)
    name: string;

    @ApiProperty({ nullable: true ,example:null})
    @IsOptional()
    @IsUrl()
    image_url?: string;



}