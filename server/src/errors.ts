export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends DomainError {}

export class DuplicateEmailError extends DomainError {
  constructor(message = 'An account with that email already exists.') {
    super(message);
  }
}

export class DuplicateUsernameError extends DomainError {
  constructor(message = 'That username is already taken.') {
    super(message);
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor(message = 'Invalid username or password.') {
    super(message);
  }
}

export class NotFoundError extends DomainError {
  constructor(message = 'Not found.') {
    super(message);
  }
}
