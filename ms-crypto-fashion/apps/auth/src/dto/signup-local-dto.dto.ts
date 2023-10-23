import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class SignupLocalDto {
    @ApiProperty({example:"user"})
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(3)
    username: string;
    @ApiProperty({example:"user@gmail.com"})
    @IsEmail()
    email: string;
    @ApiProperty({example:"user"})
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(3)
    password: string;
}