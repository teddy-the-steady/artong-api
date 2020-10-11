class ExtendableError extends Error {
  errorMessage: string;
  statusCode: number;
  errorCode: number | null;
  constructor(message: string, statusCode: number, errorCode: number | null) {
    if (new.target === ExtendableError)
      throw new TypeError('Abstract class "ExtendableError" cannot be instantiated directly.');
    super(message);
    this.name = this.constructor.name;
    this.errorMessage = message;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequest extends ExtendableError {
  constructor(message: string, errorCode: number | null) {
    if (!message) message = 'Bad Request'
    super(message, 400, errorCode);
  }
}

class Unauthorized extends ExtendableError {
  constructor(message: string, errorCode: number | null) {
    if (!message) message = 'Unauthorized'
    super(message, 401, errorCode);
  }
}

class Forbidden extends ExtendableError {
  constructor(message: string, errorCode: number | null) {
    if (!message) message = 'Forbidden'
    super(message, 403, errorCode);
  }
}

class NotFound extends ExtendableError {
  constructor(message: string, errorCode: number | null) {
    if (!message) message = 'Not Found'
    super(message, 404, errorCode);
  }
}

class Conflict extends ExtendableError {
  constructor(message: string, errorCode: number | null) {
    if (!message) message = 'Conflict'
    super(message, 409, errorCode);
  }
}

class UnprocessableEntity extends ExtendableError {
  constructor(message: string, errorCode: number | null) {
    if (!message) message = 'Unprocessable Entity'
    super(message, 422, errorCode);
  }
}

class InternalServerError extends ExtendableError {
  constructor(message: string, errorCode: number | null) {
    if (!message) message = 'Internal Server Error'
    super(message, 500, errorCode);
  }
}

export {BadRequest, Unauthorized, Forbidden, NotFound, Conflict, UnprocessableEntity, InternalServerError}