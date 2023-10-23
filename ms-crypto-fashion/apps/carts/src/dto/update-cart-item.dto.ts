import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from "class-validator";

export class UpdateCartItemDto {
    @ApiProperty()
    @IsNumber()
    @IsInt()
    @Min(1)
    quantity: number = 1

    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(3)
    vrnt_id?: string
}