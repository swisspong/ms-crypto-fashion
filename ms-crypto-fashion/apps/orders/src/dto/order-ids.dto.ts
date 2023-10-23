import { ApiProperty } from "@nestjs/swagger"
import { Transform, Type } from "class-transformer"
import { IsArray, IsNotEmpty, IsString, Length } from "class-validator"


export class OrderIdsDto {
    @ApiProperty({})
    @IsArray()
    @IsString({ each: true })
    @Type(() => String)
    orderIds: string[]

}