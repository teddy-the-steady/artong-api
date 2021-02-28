const UnknownError= {code: 1000, message: '알 수 없는 오류입니다 관리자에게 문의하세요'}; // unknown 오류
const ValidationError: number = 4000; // validation 오류
const MissingRequiredData = {code: 4002, message: 'Request body cannot be null'}; // 바디 데이터 누락
const UniqueValueDuplicated = {code: 4003, message: 'Unique value duplicated'}; // 유니크 값 중복 발생
const SyntaxError: number = 4004; // Syntax 에러
const PositiveValueRequired = {code: 4005, message: '수량 0 변경시 삭제 버튼을 눌러주세요'}; // 양의 정수 오류
const AWSError = 5000; // AWS 관련 에러
const NoPermission = {code: 5001, message: 'No permission to perform this action'}; // 권한 에러
const UpdateFailed = {code: 5002, message: 'Update failed'}; // db 업데이트 실패

export {
    UnknownError,
    ValidationError,
    MissingRequiredData,
    UniqueValueDuplicated,
    SyntaxError,
    PositiveValueRequired,
    AWSError,
    NoPermission,
    UpdateFailed,
};
