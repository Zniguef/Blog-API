import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { LoginDto, RegisterDto } from 'src/models/user.models';
import { AuthService } from './auth.service';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body(ValidationPipe) credentials: {user: RegisterDto}) {
    return this.authService.register(credentials.user)
  }

  @Post('login')
  login(@Body(ValidationPipe) credentials: {user: LoginDto}) {
    return this.authService.login(credentials.user)
  }
}
