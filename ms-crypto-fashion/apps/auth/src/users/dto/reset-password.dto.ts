import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsString, Length } from "class-validator";

export class ResetPasswordDto {
    @ApiProperty()
    @Transform(({ value }) => typeof value === 'string' ? value?.trim() : value)
    @IsOptional()
    @IsString()
    @Length(4)
    password?: string;
}