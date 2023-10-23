import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsString } from "class-validator";

export class DeleteManyItemsDto {

    @ApiProperty({})
    @IsArray()
    @IsString({ each: true })
    @Type(() => String)
    @Transform(({ value }) => typeof value === "string" ? [value?.trim()] : value)
    items: string[];

}