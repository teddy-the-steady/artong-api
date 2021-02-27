import { BadRequest, InternalServerError, Forbidden } from './errors';
import * as errorCodes from './errorCodes';

const controllerErrorWrapper = function(error: any) {
    console.log(error)
    if (error instanceof BadRequest) {
        throw new BadRequest(error['errorMessage'], error['errorCode'])
    } else if (error instanceof InternalServerError) {
        throw new InternalServerError(error['errorMessage'], error['errorCode'])
    } else if (error instanceof Forbidden) {
        throw new Forbidden(error['errorMessage'], error['errorCode'])
    } else { ///// for production
        throw new InternalServerError(errorCodes.UnknownError.message, errorCodes.UnknownError.code)
    // } else { ///// for development
    //     throw new InternalServerError(error, errorCodes.UnknownError.code);
    }
}

export default controllerErrorWrapper;