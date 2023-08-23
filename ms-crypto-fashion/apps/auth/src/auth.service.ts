import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt.interface';
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from '@nestjs/config';
import * as crypto from "crypto"
import { UsersRepository } from './users/users.repository';
import { SigninMetamaskDto } from './dto/signin-metamask.dto';
import { ethers } from 'ethers';
import ShortUniqueId from 'short-unique-id';

@Injectable()
export class AuthService {
  private readonly uid = new ShortUniqueId();
  constructor(private readonly usersRepository: UsersRepository, private readonly jwtService: JwtService, private readonly configService: ConfigService) { }

  getHello(): string {
    return 'jkffffff Test game';
  }

  async signinMetamask(signinMetamaskDto: SigninMetamaskDto, res: any) {
    try {
      const { signedMessage, message, address } = signinMetamaskDto;
      let user = await this.usersRepository.findOne({ address })
      const recoveredAddress = ethers.verifyMessage(message, signedMessage);
      console.log(recoveredAddress);
      if (recoveredAddress !== address) {
        throw new UnauthorizedException()
      }
      if (!user) {
        user = await this.usersRepository.create({ user_id: `user_${this.uid.stamp(15)}`, address })
      }

      const accessToken = await this.signToken({ sub: user.user_id, role: user.role, merchant: user.merchant, permission: user.permission })
      res.cookie("token", accessToken)
      return { accessToken }
    } catch (error) {
      throw error
    }
  }

  async genNonce() {
    const nonce = crypto.randomBytes(32).toString('hex');
    return { nonce }
  }

  async signToken(jwtPayload: JwtPayload) {
    return this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get('JWT_SECRET', { infer: true }),
      expiresIn: '15h',
    })
  }

}
