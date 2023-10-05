import { Controller, Get, Post, Body, Res, HttpCode, UseGuards, Req, Logger, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninLocalDto } from './dto/signin-local-dto.dto';
import { SigninMetamaskDto } from './dto/signin-metamask-dto.dto';
import { SignupLocalDto } from './dto/signup-local-dto.dto';
import { Public } from '@app/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
@ApiTags("Auth")
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name)
  constructor(private readonly authService: AuthService) { }


  @Public()
  @Get("nonce")
  getNonce() {
    return this.authService.genNonce()
  }

  @Public()
  @Post('signin')
  signin(@Res({ passthrough: true }) res: Response, @Body() signinDto: SigninLocalDto) {
    return this.authService.signinLocal(signinDto, res);
  }

  @Public()
  @Post('signin/metamask')
  signinMetamask(@Res({ passthrough: true }) res, @Body() signinDto: SigninMetamaskDto) {

    return this.authService.signinMetamask(signinDto, res);
  }
  @Public()
  @UseGuards(AuthGuard('google'))
  @Get('google')
  googleLogin() {
    // Initiates the Google OAuth login process
  }
  @Public()
  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  signinGoogle(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    this.logger.log("google callback",req.user)
    return this.authService.googleSignin(req.user, res);
  }


  @Public()
  @Post('signin/admin')
  siginAdmin(@Res({ passthrough: true }) res, @Body() signinDto: SigninLocalDto) {
    return this.authService.signinAdmin(signinDto, res)
  }

  @Public()
  @Post('signup')
  signup(@Res({ passthrough: true }) res, @Body() signupDto: SignupLocalDto) {
    return this.authService.signupLocal(signupDto, res);
  }

  @Post('signout')
  @HttpCode(204)
  signOut(@Res({ passthrough: true }) res) {
    return this.authService.signout(res)
  }

  @Public()
  @Get('email/verify')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token)
  }

  
}
