
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
interface UserJwtPayload {
    sub: string
    merchant?: string
    role: string
    permission: string[]
}

@Injectable()
export class JwtUtilsService {

    constructor(private readonly configService: ConfigService, private readonly jwtService: JwtService) { }

    async signToken(jwtPayload: UserJwtPayload) {
        return this.jwtService.signAsync(jwtPayload, {
            secret: this.configService.get('JWT_SECRET', { infer: true }),
            expiresIn: '15m',
        })
    }
}