import { PermissionFormat } from "@app/common/enums";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, ValidateNested } from "class-validator";
// import { PermissionFormat } from "../../common/enums/permission.enum";

class PermissionDto {
    @ApiProperty()

    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(3)
    @IsEnum(PermissionFormat)
    permission: string;

}

export class CreateAdminDto {
    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(3)
    username: string;
    @ApiProperty({example:"test@gmail.com"})
    @IsEmail()
    email: string;
    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(3)
    password: string;

    @ApiProperty({ isArray: true, type: PermissionDto })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PermissionDto)
    permissions?: PermissionDto[]
}