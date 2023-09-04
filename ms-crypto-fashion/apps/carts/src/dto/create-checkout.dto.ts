import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, Length, ValidateNested } from "class-validator";
import { PaymentMethodFormat } from "../schemas/cart.schema";

// class ItemDto {
//     @ApiProperty()
//     @IsString()
//     item_id: string;
// }
export class CreateCheckoutDto {

    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(3)
    mcht_id: string


    // @ApiProperty({ example: [{ url: "https://cdn.shopify.com/s/files/1/2303/2711/files/2_e822dae0-14df-4cb8-b145-ea4dc0966b34.jpg?v=1617059123" }] })
    // @IsArray()
    // @ValidateNested({ each: true })
    // @Type(() => ImageDto)
    // items: ImageDto[];
    // @ApiProperty()
    // @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    // @IsOptional()
    // @IsString()
    // @IsNotEmpty()
    // @Length(3)
    // mcht_id: string
}

export class CreateCheckoutItemsDto {
    @ApiProperty()
    @IsEnum(PaymentMethodFormat)
    payment_method: PaymentMethodFormat

    @ApiProperty({})
    @IsArray()
    @IsString({ each: true })
    // @ValidateNested({ each: true })
    @Type(() => String)
    items: string[];

}
