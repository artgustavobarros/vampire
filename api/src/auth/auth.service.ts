import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { uniqueViolationConstraint } from "../common/pg-errors.js";
import type { User } from "../db/schema.js";
import { slugUsername } from "../users/slug-username.js";
import {
  BCRYPT_COST,
  DM_USERNAME,
  toPublicUser,
  USERNAME_TAKEN,
  UsersService,
} from "../users/users.service.js";
import type { AuthResponse, LoginDto, SignupDto } from "./auth.schemas.js";

const EMAIL_TAKEN = 'E-mail já cadastrado. Use "Entrar".';
/** tentativas com um nome de usuário gerado, se outro cadastro o pegar antes */
const GENERATED_ATTEMPTS = 3;

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

  /** Sem `username`, gera um livre a partir do nome (ver `slugUsername`). */
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
      username !== undefined &&
      (username === DM_USERNAME || (await this.users.findByUsername(username)))
    ) {
      throw new ConflictException(USERNAME_TAKEN);
    }
    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
    return this.create({ email, name, passwordHash }, username);
  }

  /**
   * Com `username` informado, colisão é `409`. Gerado, se outro cadastro o
   * pegar entre a escolha e a gravação, tenta o próximo livre.
   */
  private async create(
    input: { email: string; name: string; passwordHash: string },
    username: string | undefined,
    attempt = 1
  ): Promise<AuthResponse> {
    try {
      return await this.respond(
        await this.users.create({
          ...input,
          username:
            username ??
            (await this.users.freeUsername(slugUsername(input.name))),
        })
      );
    } catch (error) {
      // cadastro simultâneo com o mesmo e-mail ou usuário
      const constraint = uniqueViolationConstraint(error);
      if (constraint === null) {
        throw error;
      }
      const usernameTaken = constraint === "users_username_unique";
      if (
        usernameTaken &&
        username === undefined &&
        attempt < GENERATED_ATTEMPTS
      ) {
        return this.create(input, username, attempt + 1);
      }
      throw new ConflictException(
        usernameTaken ? USERNAME_TAKEN : EMAIL_TAKEN,
        { cause: error }
      );
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
