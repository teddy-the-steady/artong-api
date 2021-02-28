import { BadRequest, InternalServerError, Forbidden } from './errors';
import { UnknownError, ValidationError } from './errorCodes';

const controllerErrorWrapper = function(error: any) {
	console.log(error)
	if (error instanceof BadRequest) {
		switch (error.errorCode) {
			case 4000:
				if (process.env.ENV === 'PROD') {
					throw new BadRequest(ValidationError.message, ValidationError.code);
				} else {
					throw new BadRequest(error.errorMessage, UnknownError.code);
				}
			default:
				throw new BadRequest(error['errorMessage'], error['errorCode'])
		}
	} else if (error instanceof InternalServerError) {
		throw new InternalServerError(error['errorMessage'], error['errorCode'])
	} else if (error instanceof Forbidden) {
		throw new Forbidden(error['errorMessage'], error['errorCode'])
	} else {
		if (process.env.ENV === 'PROD') {
			throw new InternalServerError(UnknownError.message, UnknownError.code)
		} else {
			throw new InternalServerError(error, UnknownError.code);
		}
	}
}

export default controllerErrorWrapper;