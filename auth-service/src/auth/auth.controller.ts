import { Controller, Get, Post, Body, Patch, Param, Delete, Response, Res, HttpCode, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';

import { SigninLocalDto } from './dto/signin-local-dto.dto';
import { Public } from 'src/common/decorators';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { SignupLocalDto } from './dto/signup-local-dto.dto';
import { SigninMetamaskDto } from './dto/signin-metamask-dto.dto';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) { }


  @Public()
  @Get("nonce")
  getNonce() {
    return this.authService.genNonce()
  }

  @Public()
  @Post('signin')
  signin(@Res({ passthrough: true }) res, @Body() signinDto: SigninLocalDto) {
    this.logger.debug(signinDto, {})
    return this.authService.signinLocal(signinDto, res);
  }
  
  @Public()
  @Post('signin/metamask')
  signinMetamask(@Res({ passthrough: true }) res, @Body() signinDto: SigninMetamaskDto) {

    return this.authService.signinMetamask(signinDto, res);
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



}
