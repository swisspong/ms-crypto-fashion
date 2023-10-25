import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Max, Min, ValidateNested } from "class-validator";

export class CommentDto {
    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(3)
    text: string;

    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(3)
    prod_id: string



    @ApiProperty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number


}

export class CreateCommentDto {
    @ApiProperty({ isArray: true, type: CommentDto })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CommentDto)
    comments: CommentDto[]

    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(3)
    order_id: string

    @ApiProperty()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(3)
    mcht_id: string

    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => typeof value === "string" ? value?.trim() : value)
    @IsString()
    @IsNotEmpty()
    @Length(3)
    user_name: string;

    @ApiProperty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating_mcht: number

}
