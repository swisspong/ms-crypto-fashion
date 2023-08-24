import { Controller, Get, Post, Body,  Res, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninLocalDto } from './dto/signin-local-dto.dto';
import { SigninMetamaskDto } from './dto/signin-metamask-dto.dto';
import { SignupLocalDto } from './dto/signup-local-dto.dto';
import { Public } from '@app/common/decorators';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @Public()
  @Get("nonce")
  getNonce() {
    return this.authService.genNonce()
  }

  @Public()
  @Post('signin')
  signin(@Res({ passthrough: true }) res, @Body() signinDto: SigninLocalDto) {
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
