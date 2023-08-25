import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config"
import { Request as RequestType } from 'express';
import { UserJwtPayload } from "@app/common/interfaces/jwt.interface";
// import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.extractJWT,
                // ExtractJwt.fromAuthHeaderAsBearerToken()
                ExtractJwt.fromAuthHeaderAsBearerToken()
            ]),
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }
    private static extractJWT(req: RequestType): string | null {
        if (
            req.cookies &&
            'token' in req.cookies &&
            req.cookies.token.length > 0
        ) {
            return req.cookies.token;
        }
        return null;
    }
    async validate(payload: UserJwtPayload) {
        return { ...payload };
    }
}