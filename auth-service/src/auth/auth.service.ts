import { Injectable, HttpException, HttpStatus, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { SigninLocalDto } from './dto/signin-local-dto.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/interfaces';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { SignupLocalDto } from './dto/signup-local-dto.dto';
import { UserRepository } from 'src/users/users.repository';
import * as bcrypt from 'bcrypt';
import ShortUniqueId from 'short-unique-id';
import { RoleFormat } from 'src/users/schemas/user.schema';
import * as crypto from "crypto"
import { SigninMetamaskDto } from './dto/signin-metamask-dto.dto';
import { ethers } from 'ethers';
import { comparePassword, hashPassword } from 'src/shared/operation.util';

@Injectable()
export class AuthService {
  private readonly uid = new ShortUniqueId();
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly usersRepository: UserRepository
  ) {
  }
  genNonce() {
    const nonce = crypto.randomBytes(32).toString('hex');
    return { nonce }
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

      const accessToken = await this.signToken({  sub: user.user_id, role: user.role, merchant: user?.merchant?.toString(), permission: user.permission })
      res.cookie("token", accessToken)
      return { accessToken }
    } catch (error) {
      throw error
    }
  }
  async signinLocal(signinLocalDto: SigninLocalDto, res: any) {
    try {
      const user = await this.usersRepository.findOne({ email: signinLocalDto.email })

      if (!user) throw new NotFoundException('Account not found.');

      if (!await comparePassword(signinLocalDto.password, user.password))
        throw new HttpException('Password not match.', HttpStatus.BAD_REQUEST);

      const accessToken = await this.signToken({  sub: user.user_id, role: user.role, merchant: user?.merchant?.toString(), permission: user.permission })
      res.cookie("token", accessToken)
      return { accessToken }
    } catch (error) {
      throw error
    }
  }
  async signupLocal(signupLocalDto: SignupLocalDto, res: any) {
    try {
      const user = await this.usersRepository.findOne({ email: signupLocalDto.email })

      if (user) throw new HttpException('Email is already exist.', HttpStatus.BAD_REQUEST);

      const hash = await hashPassword(signupLocalDto.password)

      const newUser = await this.usersRepository.create({ ...signupLocalDto, user_id: `user_${this.uid.stamp(15)}`, password: hash })

      const accessToken = await this.signToken({  sub: newUser.user_id, role: newUser.role, permission: newUser.permission })

      res.cookie("token", accessToken)
      return { accessToken }

    } catch (error) {
      throw error
    }
  }

  // TODO: sigin admin

  async signinAdmin(signinLocalDto: SigninLocalDto, res: any) {
    try {
      const user = await this.usersRepository.findOne({ email: signinLocalDto.email })

      if (!user) throw new NotFoundException('Account not found.');

      if (user.role === RoleFormat.ADMIN) {
        if (!await comparePassword(signinLocalDto.password, user.password))
          throw new HttpException('Password not match.', HttpStatus.BAD_REQUEST);

        const accessToken = await this.signToken({  sub: user.user_id, role: user.role, merchant: user?.merchant?.toString(), permission: user.permission })
        res.cookie("token", accessToken)
        return { accessToken }
      } else {
        throw new HttpException('You are not admin.', HttpStatus.BAD_REQUEST);

      }

    } catch (error) {
      throw error
    }
  }

  async signout(res: any) {
    res.clearCookie("token")
  }


  async signToken(jwtPayload: JwtPayload) {
    return this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get('JWT_SECRET', { infer: true }),
      expiresIn: '15h',
    })
  }

 
}
