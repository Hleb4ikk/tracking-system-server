import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { type Response, type Request } from 'express';
import { createUserSchema, type CreateUserDto } from 'src/schemas/userSchemas';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { StatusCodes } from 'http-status-codes';
import { AppConfigService } from '../configuration/appConfig.service';
import { loginSchema, type LoginUserDto } from 'src/schemas/authSchemas';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: AppConfigService,
  ) {}

  @Post('/login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  @HttpCode(StatusCodes.OK)
  async login(@Body() loginUserDto: LoginUserDto, @Res() response: Response) {
    const { user, accessToken, refreshToken } =
      await this.authService.login(loginUserDto);

    response.cookie('accessToken', accessToken, {
      ...this.configService.cookie,
      maxAge: this.configService.jwt.accessTokenAge,
    });
    response.cookie('refreshToken', refreshToken, {
      ...this.configService.cookie,
      maxAge: this.configService.jwt.refreshTokenAge,
    });
    return response.json({
      message: 'Successfully logged in!',
      user,
    });
  }

  @Post('/register')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  @HttpCode(StatusCodes.OK)
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.register(createUserDto);
    response.cookie('accessToken', accessToken, {
      ...this.configService.cookie,
      maxAge: this.configService.jwt.accessTokenAge,
    });
    response.cookie('refreshToken', refreshToken, {
      ...this.configService.cookie,
      maxAge: this.configService.jwt.refreshTokenAge,
    });
    return response.json({
      message: 'Successfully registered!',
      user,
    });
  }

  @Post('/logout')
  @HttpCode(StatusCodes.OK)
  logout(@Res() response: Response) {
    response.cookie('accessToken', '', {
      maxAge: 0,
    });
    response.cookie('refreshToken', '', {
      maxAge: 0,
    });
    return response.json({ message: 'Successfully logged out' });
  }
}
