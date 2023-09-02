import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as crypto from "crypto"
import { UsersRepository } from './users/users.repository';
import { SigninMetamaskDto } from './dto/signin-metamask-dto.dto';
import { ethers } from 'ethers';
import ShortUniqueId from 'short-unique-id';
import { SigninLocalDto } from './dto/signin-local-dto.dto';
import { SignupLocalDto } from './dto/signup-local-dto.dto';
// import { RoleFormat } from './users/schema/user.schema';
import { JwtUtilsService } from '@app/common/jwt/jwt-utils.service';
import { HashService } from '@app/common';
import { RoleFormat } from '@app/common/enums';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private readonly uid = new ShortUniqueId();
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtUtilsService: JwtUtilsService,
    private readonly hashSerive: HashService
  ) { }

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

      const accessToken = await this.jwtUtilsService.signToken({ sub: user.user_id, role: user.role, merchant: user.mcht_id, permission: user.permission })
      res.cookie("token", accessToken)
      return { accessToken }
    } catch (error) {
      throw error
    }

  }

  genNonce() {
    const nonce = crypto.randomBytes(32).toString('hex');
    return { nonce }
  }

  async signinLocal(signinLocalDto: SigninLocalDto, res: Response) {
    try {
      const user = await this.usersRepository.findOne({ email: signinLocalDto.email })

      if (!user) throw new NotFoundException('Account not found.');

      if (!await this.hashSerive.comparePassword(signinLocalDto.password, user.password))
        throw new HttpException('Password not match.', HttpStatus.BAD_REQUEST);

      const accessToken = await this.jwtUtilsService.signToken({ sub: user.user_id, role: user.role, merchant: user?.mcht_id, permission: user.permission })
      res.cookie("token", accessToken, {
        // secure: true, 
        httpOnly: false, 
        // sameSite: 'none',
        domain: 'example.com'
      })
      console.log(res)
      return { accessToken }
    } catch (error) {
      throw error
    }

  }
  async signupLocal(signupLocalDto: SignupLocalDto, res: any) {
    try {
      const user = await this.usersRepository.findOne({ email: signupLocalDto.email })

      if (user) throw new HttpException('Email is already exist.', HttpStatus.BAD_REQUEST);

      const hash = await this.hashSerive.hashPassword(signupLocalDto.password)

      const newUser = await this.usersRepository.create({ ...signupLocalDto, user_id: `user_${this.uid.stamp(15)}`, password: hash })

      const accessToken = await this.jwtUtilsService.signToken({ sub: newUser.user_id, role: newUser.role, permission: newUser.permission })

      res.cookie("token", accessToken)
      return { accessToken }

    } catch (error) {
      throw error
    }
  }

  async signinAdmin(signinLocalDto: SigninLocalDto, res: any) {
    try {
      const user = await this.usersRepository.findOne({ email: signinLocalDto.email })

      if (!user) throw new NotFoundException('Account not found.');

      if (user.role === RoleFormat.ADMIN) {
        if (!await this.hashSerive.comparePassword(signinLocalDto.password, user.password))
          throw new HttpException('Password not match.', HttpStatus.BAD_REQUEST);

        const accessToken = await this.jwtUtilsService.signToken({ sub: user.user_id, role: user.role, merchant: user?.mcht_id, permission: user.permission })
        res.cookie("token", accessToken)
        return { accessToken }
      } else {
        throw new HttpException('You are not admin.', HttpStatus.BAD_REQUEST);

      }

    } catch (error) {
      throw error
    }
  }


  // genNonce() {
  //   const nonce = crypto.randomBytes(32).toString('hex');
  //   return { nonce }
  // }

  // async signinLocal(signinLocalDto: SigninLocalDto, res: any) {
  //   try {
  //     const user = await this.usersRepository.findOne({ email: signinLocalDto.email })

  //     if (!user) throw new NotFoundException('Account not found.');

  //     if (!await comparePassword(signinLocalDto.password, user.password))
  //       throw new HttpException('Password not match.', HttpStatus.BAD_REQUEST);

  //     const accessToken = await this.signToken({  sub: user.user_id, role: user.role, merchant: user?.merchant?.toString(), permission: user.permission })
  //     res.cookie("token", accessToken)
  //     return { accessToken }
  //   } catch (error) {
  //     throw error
  //   }
  // }
  // async signupLocal(signupLocalDto: SignupLocalDto, res: any) {
  //   try {
  //     const user = await this.usersRepository.findOne({ email: signupLocalDto.email })

  //     if (user) throw new HttpException('Email is already exist.', HttpStatus.BAD_REQUEST);

  //     const hash = await hashPassword(signupLocalDto.password)

  //     const newUser = await this.usersRepository.create({ ...signupLocalDto, user_id: `user_${this.uid.stamp(15)}`, password: hash })

  //     const accessToken = await this.signToken({  sub: newUser.user_id, role: newUser.role, permission: newUser.permission })

  //     res.cookie("token", accessToken)
  //     return { accessToken }

  //   } catch (error) {
  //     throw error
  //   }
  // }

  // TODO: sigin admin

  // async signinAdmin(signinLocalDto: SigninLocalDto, res: any) {
  //   try {
  //     const user = await this.usersRepository.findOne({ email: signinLocalDto.email })

  //     if (!user) throw new NotFoundException('Account not found.');

  //     if (user.role === RoleFormat.ADMIN) {
  //       if (!await comparePassword(signinLocalDto.password, user.password))
  //         throw new HttpException('Password not match.', HttpStatus.BAD_REQUEST);

  //       const accessToken = await this.signToken({  sub: user.user_id, role: user.role, merchant: user?.merchant?.toString(), permission: user.permission })
  //       res.cookie("token", accessToken)
  //       return { accessToken }
  //     } else {
  //       throw new HttpException('You are not admin.', HttpStatus.BAD_REQUEST);

  //     }

  //   } catch (error) {
  //     throw error
  //   }
  // }

  async signout(res: any) {
    res.clearCookie("token")
  }




}
