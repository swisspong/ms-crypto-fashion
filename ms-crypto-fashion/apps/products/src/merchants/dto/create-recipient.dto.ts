import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsEmail, IsIn, IsNotEmpty, IsString, Length } from "class-validator"

export class CreateRecipientDto {
    @ApiProperty({ example: "JOHN DOE" })
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(4)
    name: string
    @ApiProperty({ example: "johndoe@gmail.com" })
    @IsEmail()
    email: string;
    @ApiProperty({ example: "scb" })
    @IsNotEmpty()
    @IsString()
    @IsIn(['scb', 'ktb']) // Validate that the value is either 'scb' or 'ktb'
    'bank_account[brand]': string

    @ApiProperty({ example: "JOHN DOE" })
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(4)
    'bank_account[number]': string
    @ApiProperty({ example: "JOHN DOE" })
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(4)
    'bank_account[name]': string
}