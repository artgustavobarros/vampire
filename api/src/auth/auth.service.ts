import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { uniqueViolationConstraint } from "../common/pg-errors.js";
import type { User } from "../db/schema.js";
import {
  DM_USERNAME,
  toPublicUser,
  UsersService,
} from "../users/users.service.js";
import type { AuthResponse, LoginDto, SignupDto } from "./auth.schemas.js";

export const BCRYPT_COST = 10;
const EMAIL_TAKEN = 'E-mail já cadastrado. Use "Entrar".';
const USERNAME_TAKEN = "Nome de usuário já em uso.";

export interface JwtPayload {
  email: string;
  sub: string;
}

@Injectable()
export class AuthService {
  /** comparado quando a conta não existe, para o tempo não entregar isso */
  private readonly dummyHash = bcrypt.hashSync(
    "senha-inexistente",
    BCRYPT_COST
  );

  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService
  ) {}

  async signup({
    email,
    name,
    password,
    username,
  }: SignupDto): Promise<AuthResponse> {
    if (await this.users.findByEmail(email)) {
      throw new ConflictException(EMAIL_TAKEN);
    }
    if (
      username === DM_USERNAME ||
      (await this.users.findByUsername(username))
    ) {
      throw new ConflictException(USERNAME_TAKEN);
    }
    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
    try {
      return this.respond(
        await this.users.create({ email, name, passwordHash, username })
      );
    } catch (error) {
      // cadastro simultâneo com o mesmo e-mail ou usuário
      const constraint = uniqueViolationConstraint(error);
      if (constraint !== null) {
        throw new ConflictException(
          constraint === "users_username_unique" ? USERNAME_TAKEN : EMAIL_TAKEN,
          { cause: error }
        );
      }
      throw error;
    }
  }

  /** Com `@` o identificador é o e-mail; sem, o nome de usuário. */
  async login({ identifier, password }: LoginDto): Promise<AuthResponse> {
    const user = identifier.includes("@")
      ? await this.users.findByEmail(identifier)
      : await this.users.findByUsername(identifier);
    const ok = await bcrypt.compare(
      password,
      user?.passwordHash ?? this.dummyHash
    );
    if (!(user && ok)) {
      throw new UnauthorizedException("E-mail, usuário ou senha incorretos.");
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
