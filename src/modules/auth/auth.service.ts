import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from 'src/schemas/userSchemas';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppConfigService } from '../configuration/appConfig.service';
import { LoginUserDto } from 'src/schemas/authSchemas';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: AppConfigService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findUserByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException(
        'User with the same email has already exists',
      );
    }

    const hashed_password = await bcrypt.hash(
      createUserDto.password,
      await bcrypt.genSalt(10),
    );

    const createdUser = await this.userService.createUser({
      ...createUserDto,
      password: hashed_password,
    });
    const accessToken = jwt.sign(
      { userId: createdUser.id },
      this.configService.jwt.accessSecretValue,
      {
        expiresIn: this.configService.jwt.accessTokenAge / 1000,
      },
    );
    const refreshToken = jwt.sign(
      { userId: createdUser.id },
      this.configService.jwt.refreshSecretValue,
      {
        expiresIn: this.configService.jwt.refreshTokenAge / 1000,
      },
    );
    return { user: createdUser, accessToken, refreshToken };
  }
  async login(loginUserDto: LoginUserDto) {
    const existingUser = await this.userService.findUserByEmail(
      loginUserDto.email,
    );

    if (!existingUser) {
      throw new NotFoundException(`User with the this email wasn't found`);
    }

    const isCorrectPassword = await bcrypt.compare(
      loginUserDto.password,
      existingUser.hashed_password,
    );

    if (!isCorrectPassword) {
      throw new UnauthorizedException('Incorrect password');
    }

    const accessToken = jwt.sign(
      { userId: existingUser.id },
      this.configService.jwt.accessSecretValue,
      {
        expiresIn: this.configService.jwt.accessTokenAge / 1000,
      },
    );
    const refreshToken = jwt.sign(
      { userId: existingUser.id },
      this.configService.jwt.refreshSecretValue,
      {
        expiresIn: this.configService.jwt.refreshTokenAge / 1000,
      },
    );
    const { hashed_password: _, ...userWithoutPassword } = existingUser;

    return { user: userWithoutPassword, accessToken, refreshToken };
  }
}
