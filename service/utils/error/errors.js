class ExtendableError extends Error {
  constructor(message, statusCode) {
    if (new.target === ExtendableError)
      throw new TypeError('Abstract class "ExtendableError" cannot be instantiated directly.');
    super(message);
    this.name = this.constructor.name;
    this.errorMessage = message;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.contructor);
  }
}

class BadRequest extends ExtendableError {
  constructor(message, statusCode) {
    if (arguments.length === 0)
      super('Bad Request', 400);
    else
      super(message, statusCode);
  }
}

class Unauthorized extends ExtendableError {
  constructor(message, statusCode) {
    if (arguments.length === 0)
      super('Unauthorized', 401);
    else
      super(message, statusCode);
  }
}

class Forbidden extends ExtendableError {
  constructor(message, statusCode) {
    if (arguments.length === 0)
      super('Forbidden', 403);
    else
      super(message, statusCode);
  }
}

class NotFound extends ExtendableError {
  constructor(message, statusCode) {
    if (arguments.length === 0)
      super('Not Found', 404);
    else
      super(message, statusCode);
  }
}

class Conflict extends ExtendableError {
  constructor(message, statusCode) {
    if (arguments.length === 0)
      super('Conflict', 409);
    else
      super(message, statusCode);
  }
}

class UnprocessableEntity extends ExtendableError {
  constructor(message, statusCode) {
    if (arguments.length === 0)
      super('Unprocessable Entity', 422);
    else
      super(message, statusCode);
  }
}

class InternalServerError extends ExtendableError {
  constructor(message, statusCode) {
    if (arguments.length === 0)
      super('Internal Server Error', 500);
    else
      super(message, statusCode);
  }
}


module.exports.BadRequest = BadRequest;
module.exports.Unauthorized = Unauthorized;
module.exports.Forbidden = Forbidden;
module.exports.NotFound = NotFound;
module.exports.Conflict = Conflict;
module.exports.UnprocessableEntity = UnprocessableEntity;
module.exports.InternalServerError = InternalServerError;