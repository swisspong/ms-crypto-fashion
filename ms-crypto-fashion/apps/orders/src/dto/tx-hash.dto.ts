import { ApiProperty } from "@nestjs/swagger"
import { Transform, Type } from "class-transformer"
import { IsArray, IsNotEmpty, IsString, Length } from "class-validator"


export class TxHashDto {
    @ApiProperty({})
    @IsArray()
    @IsString({ each: true })
    @Type(() => String)
    orderIds: string[]
    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(3)
    txHash: string
}