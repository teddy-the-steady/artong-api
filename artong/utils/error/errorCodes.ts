const UnknownError= {code: 1000, message: '알 수 없는 오류입니다 관리자에게 문의하세요'}; // unknown 오류
const ValidationError = {code: 4000, message: 'Data invalid'} // validation 오류
const UniqueValueDuplicated = {code: 4001, message: 'Unique value duplicated'}; // 유니크 값 중복 발생
const SyntaxError: number = 4002; // Syntax 에러
const NoPermission = {code: 5001, message: 'No permission to perform this action'}; // 권한 에러
const DBError = {code: 5100, message: 'DB Error'};
const UpdateFailed = {code: 5101, message: 'Update failed'}; // db 업데이트 실패
const UniqueConstraint = {code: 5102, message: 'Unique constraint violated'}; // db 유니크 제약조건 위반
const DBSyntaxError = {code: 5103, message: 'DB Syntax error'};
const AWSError = 5200; // AWS 관련 에러

export {
    UnknownError,
    ValidationError,
    UniqueValueDuplicated,
    SyntaxError,
    NoPermission,
    DBError,
    UpdateFailed,
    UniqueConstraint,
    DBSyntaxError,
    AWSError,
};
