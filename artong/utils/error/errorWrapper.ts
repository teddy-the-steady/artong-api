export {};
const {BadRequest, InternalServerError, Forbidden} = require('./errors');
const errorCodes = require('./errorCodes');

module.exports.controllerErrorWrapper = function(error: any) {
    if (error instanceof BadRequest) {
        throw new BadRequest(error['errorMessage'], error['errorCode'])
    } else if (error instanceof InternalServerError) {
        throw new InternalServerError(error['errorMessage'], error['errorCode'])
    } else if (error['details'] && error['details'][0]['message']) { // Joi Error
        if (error['details'][0]['type'] === 'number.positive') {
            throw new BadRequest(errorCodes.PositiveValueRequired.message, errorCodes.PositiveValueRequired.code)
        }
        throw new BadRequest(error['details'][0]['message'], errorCodes.MissingRequiredData.code)
    } else if (error instanceof Forbidden) {
        throw new Forbidden(error['errorMessage'], error['errorCode'])
    } else {
        throw new InternalServerError(errorCodes.UnknownError.message, errorCodes.UnknownError.code)
    }
}