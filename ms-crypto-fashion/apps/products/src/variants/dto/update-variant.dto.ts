import { ApiProperty } from "@nestjs/swagger"
import { Type, Transform } from "class-transformer"
import { IsArray, ArrayNotEmpty, ValidateNested, IsNumber, Min, IsString, IsNotEmpty, Length, IsOptional, IsUrl } from "class-validator"
import { VariantSelectedDto } from "./create-variant.dto";

class EditVariantDto {
    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(3)
    vrnt_id: string;
    @ApiProperty({ isArray: true, type: VariantSelectedDto })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => VariantSelectedDto)
    variant_selecteds: VariantSelectedDto[]

    @ApiProperty()
    @IsNumber()
    @Min(0)
    price: number;

}
export class UpdateVariantDto {
    @ApiProperty({ isArray: true, type: EditVariantDto })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => EditVariantDto)
    variants: EditVariantDto[]

}
class VariantDto {
    @ApiProperty({ isArray: true, type: VariantSelectedDto })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => VariantSelectedDto)
    variant_selecteds: VariantSelectedDto[]

    @ApiProperty()
    @IsNumber()
    @Min(0)
    price: number;
    @ApiProperty()
    @IsNumber()
    @Min(0)
    stock: number;
}

export class UpdateVariantByIdDto extends VariantDto {
    @ApiProperty({ example: "https://cdn.shopify.com/s/files/1/2303/2711/files/2_e822dae0-14df-4cb8-b145-ea4dc0966b34.jpg?v=1617059123" })
    @IsOptional()
    @IsString()
    image_url?: string
}

