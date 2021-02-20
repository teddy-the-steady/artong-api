export {};
const {BadRequest, InternalServerError, Forbidden} = require('./errors');
const errorCodes = require('./errorCodes');

module.exports.controllerErrorWrapper = function(error: any) {
    console.log(error)
    if (error instanceof BadRequest) {
        throw new BadRequest(error['errorMessage'], error['errorCode'])
    } else if (error instanceof InternalServerError) {
        throw new InternalServerError(error['errorMessage'], error['errorCode'])
    } else if (error instanceof Forbidden) {
        throw new Forbidden(error['errorMessage'], error['errorCode'])
    } else {
        throw new InternalServerError(errorCodes.UnknownError.message, errorCodes.UnknownError.code)
    }
}