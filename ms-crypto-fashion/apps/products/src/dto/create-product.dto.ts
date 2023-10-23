import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString, Length, IsNotEmpty, IsOptional, IsInt, Min, IsNumber, IsUrl, IsBoolean, IsArray, ValidateNested, ArrayMinSize, ValidationError, Contains, ArrayContains, ArrayUnique } from 'class-validator';


class CategoryDto {
    @ApiProperty()

    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(3)
    cat_id: string;

}
class ImageDto {
    @ApiProperty()
    @IsString()
    url: string;
}
export class CreateProductDto {
    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(3)
    name: string;

    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(2)
    sku?: string;

    @ApiProperty()
    @IsInt()
    @Min(0)
    stock: number;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ example: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dapibus." })
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(10)
    description: string

    @ApiProperty({ example: [{ url: "https://cdn.shopify.com/s/files/1/2303/2711/files/2_e822dae0-14df-4cb8-b145-ea4dc0966b34.jpg?v=1617059123" }] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImageDto)
    image_urls: ImageDto[];

    @ApiProperty()
    @IsBoolean()
    available: boolean = false

    @ApiProperty({ isArray: true, type: CategoryDto })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CategoryDto)
    categories: CategoryDto[]
    @ApiProperty({ isArray: true, type: CategoryDto })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CategoryDto)
    categories_web: CategoryDto[]

    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    @ArrayUnique()
    // @ArrayContains([PaymentMethodFormat.CREDIT, PaymentMethodFormat.WALLET])
    payment_methods: string[];
}

