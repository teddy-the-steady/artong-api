import { BadRequest, InternalServerError, Forbidden, Unauthorized } from './errors';
import { DBError, UniqueConstraint, UnknownError, ValidationError, DBSyntaxError } from './errorCodes';

const controllerErrorWrapper = function(error: any) {
	console.error(error)
	if (error instanceof BadRequest) {
		throw new BadRequest(error.errorMessage, error.errorCode);
	} else if (error instanceof InternalServerError) {
		switch (error.errorCode) {
			case DBError.code:
				if (error.errorMessage.code === '23505') throw new InternalServerError(error.errorMessage.detail, UniqueConstraint.code);
				if (error.errorMessage.code === '42601') throw new InternalServerError(DBSyntaxError.message + ' at position: ' + error.errorMessage.position, DBSyntaxError.code);
		}
		throw new InternalServerError(error.errorMessage, error.errorCode);
	} else if (error instanceof Forbidden) {
		throw new Forbidden(error.errorMessage, error.errorCode);
	}	else if (error instanceof Unauthorized) {
		throw new Unauthorized(error.errorMessage, error.errorCode);
	} else {
		throw new InternalServerError(error, UnknownError.code);
	}
}

export default controllerErrorWrapper;