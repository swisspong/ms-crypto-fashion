import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class CreditCardPaymentDto {
    @ApiProperty({ example: "JOHN DOE" })
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(4)
    token: string



    @ApiProperty({ example: 1000 })
    @IsNumber()
    amount_: number
}