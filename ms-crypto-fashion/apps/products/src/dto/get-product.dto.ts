import { ApiProperty, ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsInt, IsOptional, IsString } from "class-validator";
import { GetProductBaseDto } from "./get-product-base.dto";


export class GetProductDto extends GetProductBaseDto {

    @ApiPropertyOptional({
        type: [String],
        description: 'Array of categoy IDs',
        example: ['category1Id', 'category2Id'],

    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    @Type(() => String)
    @Transform(({ value }) => typeof value === "string" ? [value?.trim()] : value)
    cat_ids: string[];
}