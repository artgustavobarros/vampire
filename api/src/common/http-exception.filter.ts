import { STATUS_CODES } from "node:http";
import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import type { Response } from "express";

/** Erros do body-parser (`http-errors`) chegam com `status` e `type`. */
interface BodyParserError {
  status: number;
  type: string;
}

const BODY_PARSER_MESSAGES: Record<string, string> = {
  "entity.too.large": "A requisição passou do limite de 1 MB.",
};

function isBodyParserError(error: unknown): error is BodyParserError {
  return (
    typeof error === "object" &&
    error !== null &&
    typeof (error as BodyParserError).status === "number" &&
    typeof (error as BodyParserError).type === "string"
  );
}

function messageOf(exception: HttpException): string {
  const body = exception.getResponse();
  if (typeof body === "string") {
    return body;
  }
  const { message } = body as { message?: unknown };
  if (Array.isArray(message)) {
    return String(message[0] ?? exception.message);
  }
  return typeof message === "string" ? message : exception.message;
}

/** Responde sempre `{ statusCode, message, error }`, com `message` em texto. */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>();
    let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Algo deu errado. Tente novamente.";

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = messageOf(exception);
    } else if (isBodyParserError(exception)) {
      statusCode = exception.status;
      message = BODY_PARSER_MESSAGES[exception.type] ?? "Requisição inválida.";
    } else {
      this.logger.error(exception);
    }

    res.status(statusCode).json({
      error: STATUS_CODES[statusCode] ?? "Error",
      message,
      statusCode,
    });
  }
}
