export {};
const Joi = require('joi');

const pagingSchema = Joi.object({
    page_no: Joi.number().positive().required(),
    page_size: Joi.number().positive().required()
});
module.exports.pagingSchema = pagingSchema

module.exports.userSchema = Joi.object({
    principalId: Joi.string().min(1).max(50).required()
});

module.exports.testSchema = Joi.object({
    productName: Joi.string().min(1).max(50),
    price: Joi.number().positive(),
    categoryId: Joi.number().positive()
});

module.exports.signupSchema = Joi.object({
    principalId: Joi.string().min(1).max(50).required(),
    loginId: Joi.string().min(1).max(20).required(),
    loginName: Joi.string().min(1).max(50).required()
});

module.exports.userConfirmSchema = Joi.object({
    loginId: Joi.string().min(1).max(20).required()
});

module.exports.searchWordSchema = pagingSchema.keys({
    searchWord: Joi.string().min(0).max(50).allow(''),
});

module.exports.searchWordNoPagingSchema = Joi.object({
    searchWord: Joi.string().min(0).max(50).allow('')
});

module.exports.productListByOriginalBarcodeSchema = Joi.object({
    originalBarcode: Joi.string().min(0).max(50).allow('')
});

module.exports.packageListSchema = pagingSchema.keys({
    packageStatus: Joi.string().valid('0', '1', '3', '9').allow(''),
    customerId: Joi.string().allow('')
});

module.exports.packageCreateSchema = Joi.object({
    name: Joi.string().min(1).max(1000).required(),
    packageCondition: Joi.string().valid('0', '1', '2', '9').allow('')
});

module.exports.packageUpdateSchema = Joi.object({
    name: Joi.string().min(1).max(1000).required(),
    packageCondition: Joi.string().valid('0', '1', '2', '9').allow(''),
    palletEach: Joi.number().allow(''),
    packageStatus: Joi.string().valid('0', '1', '3', '9').allow(''),
    inDt: Joi.string().length(10).allow(''),
    location: Joi.string().min(0).max(100).allow(''),
    sellAmount: Joi.number().allow('')
});

module.exports.packageDetailUpdateSchema = Joi.object({
    itemEach: Joi.number().positive().required()
});

module.exports.packageConfirmPatchSchema = Joi.object({
    sellAmount: Joi.number().allow('')
});

module.exports.inCreateSchema = Joi.object({
    packId: Joi.number().required(),
    barcode: Joi.string().min(1).max(50).required()
});

module.exports.orderListSchema = pagingSchema.keys({
    orderStatus: Joi.string().valid('0', '1', '2', '3', '9').allow(''),
    customerId: Joi.string().allow('')
});

module.exports.orderCreateSchema = Joi.object({
    requestedCustomerDeliverDate: Joi.string().length(19).allow(''),
    packageBuyCustomerMemo: Joi.string().min(0).max(1000).allow(''),
    packIdArray: Joi.array().items(Joi.number()).max(5)
});

module.exports.orderUpdateSchema = Joi.object({
    orderStatus: Joi.string().valid('0', '1', '2', '3', '9').required(),
    orderOutDate: Joi.string().length(19).allow(''),
    deliverCarNo: Joi.string().min(0).max(50).allow(''),
    deliverName: Joi.string().min(0).max(20).allow(''),
    deliverTel: Joi.string().min(0).max(20).allow(''),
    deliverAmount: Joi.number().allow(''),
    packIdArray: Joi.array().items(Joi.number()).max(5)
});