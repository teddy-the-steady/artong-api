class ExtendableError extends Error {
  constructor(message, statusCode, errorCode) {
    if (new.target === ExtendableError)
      throw new TypeError('Abstract class "ExtendableError" cannot be instantiated directly.');
    super(message);
    this.name = this.constructor.name;
    this.errorMessage = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.contructor);
  }
}

class BadRequest extends ExtendableError {
  constructor(message, errorCode) {
    if (arguments.length === 0)
      super('Bad Request', 400);
    else if (arguments.length === 1)
      super(message, 400);
    else
      super(message, 400, errorCode);
  }
}

class Unauthorized extends ExtendableError {
  constructor(message, errorCode) {
    if (arguments.length === 0)
      super('Unauthorized', 401);
    else if (arguments.length === 1)
      super(message, 401);
    else
      super(message, 401, errorCode);
  }
}

class Forbidden extends ExtendableError {
  constructor(message, errorCode) {
    if (arguments.length === 0)
      super('Forbidden', 403);
    else if (arguments.length === 1)
      super(message, 403);
    else
      super(message, 403, errorCode);
  }
}

class NotFound extends ExtendableError {
  constructor(message, errorCode) {
    if (arguments.length === 0)
      super('Not Found', 404);
    else if (arguments.length === 1)
      super(message, 404);
    else
      super(message, 404, errorCode);
  }
}

class Conflict extends ExtendableError {
  constructor(message, errorCode) {
    if (arguments.length === 0)
      super('Conflict', 409);
    else if (arguments.length === 1)
      super(message, 409);
    else
      super(message, 409, errorCode);
  }
}

class UnprocessableEntity extends ExtendableError {
  constructor(message, errorCode) {
    if (arguments.length === 0)
      super('Unprocessable Entity', 422);
    else if (arguments.length === 1)
      super(message, 422);
    else
      super(message, 422, errorCode);
  }
}

class InternalServerError extends ExtendableError {
  constructor(message, errorCode) {
    if (arguments.length === 0)
      super('Internal Server Error', 500);
    else if (arguments.length === 1)
      super(message, 500);
    else
      super(message, 500, errorCode);
  }
}


module.exports.BadRequest = BadRequest;
module.exports.Unauthorized = Unauthorized;
module.exports.Forbidden = Forbidden;
module.exports.NotFound = NotFound;
module.exports.Conflict = Conflict;
module.exports.UnprocessableEntity = UnprocessableEntity;
module.exports.InternalServerError = InternalServerError;