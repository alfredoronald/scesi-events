/** Errores de dominio tipados (PRD §9.1/§10). Sin trazas internas al cliente. */

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace?.(this, new.target);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Datos inválidos.", details?: unknown) {
    super(400, "VALIDACION", message, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "No autenticado.") {
    super(401, "NO_AUTENTICADO", message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "No tienes permiso para esta acción.") {
    super(403, "SIN_PERMISO", message);
  }
}

export class NotFoundError extends AppError {
  constructor(recurso = "Recurso") {
    super(404, "NO_ENCONTRADO", `${recurso} no encontrado.`);
  }
}

export class ConflictError extends AppError {
  constructor(code: string, message: string, details?: unknown) {
    super(409, code, message, details);
  }
}

export class BusinessRuleError extends AppError {
  constructor(code: string, message: string, details?: unknown) {
    super(422, code, message, details);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = "Demasiadas solicitudes. Intenta de nuevo más tarde.") {
    super(429, "RATE_LIMIT", message);
  }
}
