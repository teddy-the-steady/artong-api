class ExtendableError extends Error {
  errorMessage: string | any;
  statusCode: number;
  errorCode: number | null;
  constructor(message: string | any, statusCode: number, errorCode: number | null) {
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
    if (arguments.length === 0)
      super('Bad Request', 400, null);
    else if (arguments.length === 1)
      super(message, 400, null);
    else
      super(message, 400, errorCode);
  }
}

class Unauthorized extends ExtendableError {
  constructor(message: string, errorCode: number | null) {
    if (arguments.length === 0)
      super('Unauthorized', 401, null);
    else if (arguments.length === 1)
      super(message, 401, null);
    else
      super(message, 401, errorCode);
  }
}

class Forbidden extends ExtendableError {
  constructor(message: string, errorCode: number | null) {
    if (arguments.length === 0)
      super('Forbidden', 403, null);
    else if (arguments.length === 1)
      super(message, 403, null);
    else
      super(message, 403, errorCode);
  }
}

class NotFound extends ExtendableError {
  constructor(message: string, errorCode: number) {
    if (arguments.length === 0)
      super('Not Found', 404, null);
    else if (arguments.length === 1)
      super(message, 404, null);
    else
      super(message, 404, errorCode);
  }
}

class Conflict extends ExtendableError {
  constructor(message: string, errorCode: number | null) {
    if (arguments.length === 0)
      super('Conflict', 409, null);
    else if (arguments.length === 1)
      super(message, 409, null);
    else
      super(message, 409, errorCode);
  }
}

class UnprocessableEntity extends ExtendableError {
  constructor(message: string, errorCode: number | null) {
    if (arguments.length === 0)
      super('Unprocessable Entity', 422, null);
    else if (arguments.length === 1)
      super(message, 422, null);
    else
      super(message, 422, errorCode);
  }
}

class InternalServerError extends ExtendableError {
  constructor(message: string | any, errorCode: number | null) {
    if (arguments.length === 0)
      super('Internal Server Error', 500, null);
    else if (arguments.length === 1)
      super(message, 500, null);
    else
      super(message, 500, errorCode);
  }
}

export {
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Conflict,
  UnprocessableEntity,
  InternalServerError,
};