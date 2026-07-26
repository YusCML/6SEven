/**
 * Domain errors.
 *
 * Services throw these; the HTTP layer is the only place that knows how to turn
 * them into status codes. That keeps business logic free of `req`/`res` and
 * means the same service can back a different transport later.
 */

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** Input failed a business rule. Maps to 400. */
export class ValidationError extends DomainError {}

/** A unique constraint was violated. Maps to 409. */
export class DuplicateEmailError extends DomainError {
  constructor(message = 'An account with that email already exists.') {
    super(message);
  }
}

/** Wrong email or password. Maps to 401 — deliberately does not say which. */
export class InvalidCredentialsError extends DomainError {
  constructor(message = 'Invalid email or password.') {
    super(message);
  }
}

/** The requested record does not exist. Maps to 404, or 401 for the current user. */
export class NotFoundError extends DomainError {
  constructor(message = 'Not found.') {
    super(message);
  }
}
