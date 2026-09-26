import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { CurrentUser } from "../common/current-user.decorator.js";
import { errorResponseSchema } from "../common/error-response.schema.js";
import { Public } from "../common/public.decorator.js";
import type { User } from "../db/schema.js";
import { type PublicUser, publicUserSchema } from "../users/users.schemas.js";
import { toPublicUser } from "../users/users.service.js";
import {
  type AuthResponse,
  authResponseSchema,
  type LoginDto,
  loginSchema,
  type SignupDto,
  signupSchema,
} from "./auth.schemas.js";
import { AuthService } from "./auth.service.js";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post("signup")
  @ApiOperation({ summary: "Criar conta e já entrar" })
  @ApiCreatedResponse({ standardSchema: authResponseSchema })
  @ApiBadRequestResponse({ standardSchema: errorResponseSchema })
  @ApiConflictResponse({
    description: "E-mail já cadastrado",
    standardSchema: errorResponseSchema,
  })
  signup(
    @Body({ schema: signupSchema }) body: SignupDto
  ): Promise<AuthResponse> {
    return this.auth.signup(body);
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Entrar com e-mail e senha" })
  @ApiOkResponse({ standardSchema: authResponseSchema })
  @ApiBadRequestResponse({ standardSchema: errorResponseSchema })
  @ApiUnauthorizedResponse({
    description: "E-mail ou senha incorretos",
    standardSchema: errorResponseSchema,
  })
  login(@Body({ schema: loginSchema }) body: LoginDto): Promise<AuthResponse> {
    return this.auth.login(body);
  }

  @Get("me")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Jogador da sessão" })
  @ApiOkResponse({ standardSchema: publicUserSchema })
  @ApiUnauthorizedResponse({ standardSchema: errorResponseSchema })
  me(@CurrentUser() user: User): PublicUser {
    return toPublicUser(user);
  }
}
