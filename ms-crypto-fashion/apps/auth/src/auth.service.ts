import { ForbiddenException, HttpException, HttpStatus, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ACCOUNT_NOT_FOUND, EMAIL_IS_ALREADY_IN_USE, EMAIL_NOT_VERIFIED, PASSWORD_NOT_MATCH } from '@app/common/constants/error.constant';

@Injectable()
export class AuthService {
  private readonly uid = new ShortUniqueId();
  protected readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtUtilsService: JwtUtilsService,
    private readonly hashService: HashService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) { }


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
      // res.cookie("token", accessToken)
      res.cookie("token", accessToken, {
        // secure: true, 
        httpOnly: false,
        // sameSite: 'none',
        domain: 'example.com'
      })
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

      if (!user) throw new NotFoundException(ACCOUNT_NOT_FOUND);

      if (!user.isVerified) throw new HttpException(EMAIL_NOT_VERIFIED, HttpStatus.BAD_REQUEST);

      if (!await this.hashService.comparePassword(signinLocalDto.password, user.password))
        throw new HttpException(PASSWORD_NOT_MATCH, HttpStatus.BAD_REQUEST);

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

      if ((user && user.isVerified) || (user && user.google_id)) throw new HttpException(EMAIL_IS_ALREADY_IN_USE, HttpStatus.BAD_REQUEST);

      const hash = await this.hashService.hashPassword(signupLocalDto.password)
      const emailToken = await this.uid.randomUUID(30)

      // newUser or Update Email Token

      const newUser = (user && user.emailToken) ? await this.usersRepository.findOneAndUpdate({ emailToken: user.emailToken }, {
        $set: {
          emailToken
        }
      }) :
        await this.usersRepository.create({ ...signupLocalDto, user_id: `user_${this.uid.stamp(15)}`, password: hash, emailToken })

      const mailOptions = {
        from: this.configService.get('MAIL_USER', { infer: true }) as string,
        to: newUser.email,
        subject: "Crypto Fashion Verify you email.",
        html: `
          <h2>${newUser.username} ขอบคุณสำหรับการลงทะเบียนบนเว็บไซต์ของเรา</h2>
          <h4>กรุณายืนยันอีเมลของคุณเพื่อดำเนินการต่อ...</h4>
          <a href="${this.configService.get('HOST_MAIN', { infer: true })}/verify?token=${newUser.emailToken}">ยืนยันอีเมลของคุณ</a>
        `
      }


      await this.mailerService.sendMail(mailOptions)

      return { status: "success" }

    } catch (error) {
      throw error
    }
  }

  async signinAdmin(signinLocalDto: SigninLocalDto, res: any) {
    try {
      const user = await this.usersRepository.findOne({ email: signinLocalDto.email })

      if (!user) throw new NotFoundException(ACCOUNT_NOT_FOUND);

      if (user.role !== RoleFormat.ADMIN) throw new NotFoundException(ACCOUNT_NOT_FOUND);
      if (!await this.hashService.comparePassword(signinLocalDto.password, user.password))
        throw new HttpException(PASSWORD_NOT_MATCH, HttpStatus.BAD_REQUEST);

      const accessToken = await this.jwtUtilsService.signToken({ sub: user.user_id, role: user.role, merchant: user?.mcht_id, permission: user.permission })
      // res.cookie("token", accessToken)
      res.cookie("token", accessToken, {
        // secure: true, 
        httpOnly: false,
        // sameSite: 'none',
        domain: 'example.com'
      })
      return { accessToken }


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
    res.clearCookie("token", { domain: 'example.com' })
  }


  async googleSignin(profile: any, res: Response) {
    try {
      this.logger.log(profile)
      const users = await this.usersRepository.find({ $or: [{ google_id: profile.id }, { email: profile.emails[0].value }] })
      if (users.length <= 0) {
        const newUser = await this.usersRepository.create({ user_id: `user_${this.uid.stamp(15)}`, email: profile.emails[0].value, google_id: profile.id, username: profile.displayName })
        const accessToken = await this.jwtUtilsService.signToken({ sub: newUser.user_id, role: newUser.role, permission: newUser.permission })

        // res.cookie("token", accessToken)
        res.cookie("token", accessToken, {
          // secure: true, 
          httpOnly: false,
          // sameSite: 'none',
          domain: 'example.com'
        })
        res.redirect(`http://example.com`);
        return
      } else {
        const user = users.find(user => user.google_id === profile.id && user.email === profile.emails[0].value)
        if (!user) {
          res.redirect(
            `http://example.com/signin?error=${encodeURIComponent(
              "Incorrect_Email"
            )}`
          );
          return;
        } else {
          const accessToken = await this.jwtUtilsService.signToken({ sub: user.user_id, role: user.role, permission: user.permission, merchant: user.mcht_id })
          res.cookie("token", accessToken, {
            // secure: true, 
            httpOnly: false,
            // sameSite: 'none',
            domain: 'example.com'
          })
          res.redirect(`http://example.com`);
          return
        }
      }
    } catch (error) {
      this.logger.error(error)
    }

  }


  async verifyEmail(token: string) {
    try {
      let updateUser = undefined
      const user = await this.usersRepository.findOne({ emailToken: token })
      if (user) {
        updateUser = await this.usersRepository.findOneAndUpdate({ user_id: user.user_id }, {
          $set: { isVerified: true },
          $unset: { emailToken: 1 }
        })
      }

      return { status: updateUser ? "success" : "failure" }
    } catch (error) {
      console.log(error);

    }
  }




}
