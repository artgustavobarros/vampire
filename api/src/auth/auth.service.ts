import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { isUniqueViolation } from "../common/pg-errors.js";
import type { User } from "../db/schema.js";
import { toPublicUser, UsersService } from "../users/users.service.js";
import type { AuthResponse, LoginDto, SignupDto } from "./auth.schemas.js";

export const BCRYPT_COST = 10;
const EMAIL_TAKEN = 'E-mail já cadastrado. Use "Entrar".';

export interface JwtPayload {
  email: string;
  sub: string;
}

@Injectable()
export class AuthService {
  /** comparado quando o e-mail não existe, para o tempo não entregar isso */
  private readonly dummyHash = bcrypt.hashSync(
    "senha-inexistente",
    BCRYPT_COST
  );

  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService
  ) {}

  async signup({ email, name, password }: SignupDto): Promise<AuthResponse> {
    if (await this.users.findByEmail(email)) {
      throw new ConflictException(EMAIL_TAKEN);
    }
    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
    try {
      return this.respond(
        await this.users.create({ email, name, passwordHash })
      );
    } catch (error) {
      // cadastro simultâneo com o mesmo e-mail
      if (isUniqueViolation(error)) {
        throw new ConflictException(EMAIL_TAKEN, { cause: error });
      }
      throw error;
    }
  }

  async login({ email, password }: LoginDto): Promise<AuthResponse> {
    const user = await this.users.findByEmail(email);
    const ok = await bcrypt.compare(
      password,
      user?.passwordHash ?? this.dummyHash
    );
    if (!(user && ok)) {
      throw new UnauthorizedException("E-mail ou senha incorretos.");
    }
    return this.respond(user);
  }

  private async respond(user: User): Promise<AuthResponse> {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    return {
      accessToken: await this.jwt.signAsync(payload),
      user: toPublicUser(user),
    };
  }
}
