export {};
const {BadRequest} = require('../utils/error/errors');
const {MissingRequiredData} = require('../utils/error/errorCodes');

module.exports.validate = async function (params: any, schema: any) {
  if (params) {
    params = await schema.validateAsync(params);
    return params
  } else {
    throw new BadRequest(MissingRequiredData.message, MissingRequiredData.code)
  }
}

module.exports.validateUser = async function (principalId: string, schema: any) {
  if (principalId) {    
    let userId = {principalId: principalId}
    userId = await schema.validateAsync(userId);
    return userId['principalId']
  } else {
    throw new BadRequest(MissingRequiredData.message, MissingRequiredData.code)
  }
}