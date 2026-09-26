import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { CurrentUser } from "../common/current-user.decorator.js";
import { Public } from "../common/public.decorator.js";
import type { User } from "../db/schema.js";
import { type PublicUser, toPublicUser } from "../users/users.service.js";
import {
  type LoginDto,
  loginSchema,
  type SignupDto,
  signupSchema,
} from "./auth.schemas.js";
import { type AuthResponse, AuthService } from "./auth.service.js";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post("signup")
  signup(
    @Body({ schema: signupSchema }) body: SignupDto
  ): Promise<AuthResponse> {
    return this.auth.signup(body);
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@Body({ schema: loginSchema }) body: LoginDto): Promise<AuthResponse> {
    return this.auth.login(body);
  }

  @Get("me")
  me(@CurrentUser() user: User): PublicUser {
    return toPublicUser(user);
  }
}
