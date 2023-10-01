import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsString, Length, Min } from "class-validator"

export class WithdrawDto {
    @ApiProperty({})
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(4)
    recp_id: string
    @ApiProperty({})
    @IsNumber()
    @Min(50)
    amount: number
}