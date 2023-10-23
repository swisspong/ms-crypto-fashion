import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsInt, IsOptional, IsString } from "class-validator";

// export enum SearchType {
//     MERCHANT = "merchant",
//     PRODUCT = "product"
// }
export class GetCategoryByOwnerDto {
    @ApiPropertyOptional()
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    page?: number = 1;
    @ApiPropertyOptional()
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    per_page?: number = 20;
    @ApiPropertyOptional()
    @Type(() => String)
    @IsString()
    @IsOptional()
    search?: string = "";

    // @ApiPropertyOptional({ enum: SearchType })
    // @Type(() => String)
    // @IsString()
    // @IsOptional()
    // type_search?: SearchType = SearchType.PRODUCT
    // @ApiPropertyOptional()
    // @Type(() => String)
    // @IsString()
    // @IsOptional()
    // mcht_id?: string;
    @ApiPropertyOptional({
        description: 'Sort by field.',
        example: "createdAt,asc"
    })
    @Type(() => String)
    @IsString()
    @IsOptional()
    sort?: string;

    // @ApiPropertyOptional({
    //     type: [String],
    //     description: 'Array of categoy IDs',
    //     example: ['category1Id', 'category2Id'],

    // })
    // @IsString({ each: true })
    // @IsArray()
    // @IsOptional()
    // @Type(() => String)
    // @Transform(({ value }) => typeof value === "string" ? [value?.trim()] : value)
    // cat_ids: string[];
}