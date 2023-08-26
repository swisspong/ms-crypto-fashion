import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

export class StoreQueryDto {
    @ApiPropertyOptional()
    @Type(() => Boolean)
    @IsBoolean()
    @IsOptional()
    store_front?: boolean = false;
}