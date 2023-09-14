import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsString, Length } from "class-validator";

export enum ShippingCarierFormat {
    FLASH = "flash express",
}
export class FullfillmentDto {
    @ApiProperty({ enum: ShippingCarierFormat })
    @Type(() => String)
    @IsString()
    shipping_carier: ShippingCarierFormat;

    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(3)
    tracking: string;
}