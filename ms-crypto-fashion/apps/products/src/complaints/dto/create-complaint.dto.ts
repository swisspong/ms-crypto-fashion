import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateComplaintDto {
    @ApiProperty()
    @Transform(({value}) => typeof value === "string"? value?.trim(): value)
    @IsString()
    @IsNotEmpty()
    @Length(4)  
    user_id: string

    @ApiProperty()
    @IsOptional()
    @Transform(({value}) => typeof value === "string"? value?.trim(): value)
    @IsString()
    @Length(4)
    mcht_id: string;

    @ApiProperty()
    @IsOptional()
    @Transform(({value}) => typeof value === "string"? value?.trim(): value)
    @IsString()
    @Length(4)
    prod_id: string;

    @ApiProperty()
    @Transform(({value}) => typeof value === "string"? value?.trim(): value)
    @IsString()
    @IsNotEmpty()
    @Length(10)
    detail: string


}


