
import {  ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, Length, ValidateNested } from "class-validator";
import passport from "passport";

class PermissionDto {
    @ApiProperty()

    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(3)
    permission: string;

}

export class UserResponseDto {

    @ApiProperty()
    @Transform(({value}) => typeof value === 'string'? value?.trim(): value)
    @IsString()
    @Length(4)
    user_id: string


    @ApiProperty()
    @Transform(({value}) => typeof value === 'string'? value?.trim(): value)
    @IsOptional()
    @IsString()
    @Length(4)
    username?: string;

    @ApiProperty()
    @Transform(({value}) => typeof value === 'string'? value?.trim(): value)
    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string;

    @ApiProperty()
    @Transform(({value}) => typeof value === 'string'? value?.trim(): value)
    @IsOptional()
    @IsString()
    @Length(4)
    password?: string;

    @ApiProperty()
    @Transform(({value}) => typeof value === 'string'? value?.trim(): value)
    @IsOptional()
    @IsString()
    @Length(4)
    google_id?: string;

    @ApiProperty()
    @Transform(({value}) => typeof value === 'string'? value?.trim(): value)
    @IsOptional()
    @IsString()
    @Length(4)
    role?: string;

    @ApiProperty({ isArray: true, type: PermissionDto })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PermissionDto)
    permissions?: PermissionDto[]

}