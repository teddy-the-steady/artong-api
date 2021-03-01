import { BadRequest, InternalServerError, Forbidden } from './errors';
import { DBError, UniqueConstraint, UnknownError, ValidationError, DBSyntaxError } from './errorCodes';

const controllerErrorWrapper = function(error: any) {
	console.log(error)
	if (error instanceof BadRequest) {
		switch (error.errorCode) {
			case ValidationError.code:
				if (process.env.ENV === 'prod') throw new BadRequest(ValidationError.message, ValidationError.code);
		}
		throw new BadRequest(error.errorMessage, error.errorCode);
	} else if (error instanceof InternalServerError) {
		switch (error.errorCode) {
			case DBError.code:
				if (process.env.ENV === 'prod') throw new InternalServerError(DBError.message, DBError.code);
				if (error.errorMessage.code === '23505') throw new InternalServerError(error.errorMessage.detail, UniqueConstraint.code);
				if (error.errorMessage.code === '42601') throw new InternalServerError(DBSyntaxError.message + ' at position: ' + error.errorMessage.position, DBSyntaxError.code);
		}
		throw new InternalServerError(error.errorMessage, error.errorCode);
	} else if (error instanceof Forbidden) {
		throw new Forbidden(error.errorMessage, error.errorCode);
	} else {
		if (process.env.ENV === 'prod') {
			throw new InternalServerError(UnknownError.message, UnknownError.code);
		} else {
			throw new InternalServerError(error, UnknownError.code);
		}
	}
}

export default controllerErrorWrapper;