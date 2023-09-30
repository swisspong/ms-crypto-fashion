


import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class WithdrawEthDto {
    @ApiProperty({})
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(4)
    address: string



    @ApiProperty({ example: 1000 })
    @IsNumber()
    amount: number
}