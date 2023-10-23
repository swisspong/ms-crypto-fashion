import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";


export class OrderPaginationDto {
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
}