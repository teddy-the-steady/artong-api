const ValidationError: number = 4000 // validation 오류
const MissingQueryParameter: number = 4001 // 쿼리 파라미터 누락
const MissingRequiredData: number = 4002 // 바디 데이터 누락
const AWSError = 5000 // AWS 관련 에러

module.exports.ValidationError = ValidationError;
module.exports.MissingQueryParameter = MissingQueryParameter;
module.exports.MissingRequiredData = MissingRequiredData;
module.exports.AWSError = AWSError;