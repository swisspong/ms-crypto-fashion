import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class SignupLocalDto {
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
}