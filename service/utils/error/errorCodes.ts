const ValidationError: number = 4000 // validation 오류
const MissingQueryParameter: number = 4001 // 쿼리 파라미터 누락
const MissingRequiredData = {code: 4002, message: 'Request body cannot be null'} // 바디 데이터 누락
const UniqueValueDuplicated = {code: 4003, message: 'Unique value duplicated'} // 유니크 값 중복 발생
const SyntaxError: number = 4004 // Syntax 에러
const AWSError: number = 5000 // AWS 관련 에러

export {ValidationError, MissingQueryParameter, MissingRequiredData, UniqueValueDuplicated, SyntaxError, AWSError}