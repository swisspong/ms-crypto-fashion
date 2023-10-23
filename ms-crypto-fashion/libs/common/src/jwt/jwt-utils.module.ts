
import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JwtUtilsService } from "./jwt-utils.service";



@Module({
    imports: [
        JwtModule.registerAsync({
            global: true,
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),

            }),
            inject: [ConfigService]
        })
    ],
    providers: [JwtUtilsService],
    exports: [JwtUtilsService]
})
export class JwtUtilsModule { }