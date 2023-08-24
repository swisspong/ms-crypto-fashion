import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

// * function service
export async function hashPassword(password: string) {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);

}
export async function comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash)
}

export async function signToken(jwtPayload: JwtPayload) {
    return this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get('JWT_SECRET', { infer: true }),
      expiresIn: '15m',
    })
  }