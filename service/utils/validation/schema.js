const Joi = require('@hapi/joi');

module.exports.testSchema = Joi.object({
    productName: Joi.string().min(1).max(50),
    price: Joi.number().positive(),
    categoryId: Joi.number().positive()
});

module.exports.productSchema = Joi.object({
    productName: Joi.string().min(1).max(50).required(),
    price: Joi.number().positive(). required(),
    categoryId: Joi.number().positive().required()
});

module.exports.productViewSchema = Joi.object({
    productName: Joi.string().min(1).max(50).required(),
    price: Joi.number().positive().required(),
    categoryId: Joi.number().positive().required(),
    barcode: Joi.string().required()
});

module.exports.productListSchema = Joi.object({
    barcode: Joi.string().min(0).max(50).allow(''),
    name: Joi.string().min(0).max(500).allow('')
});

module.exports.userSchema = Joi.object({
    loginId: Joi.string().min(1).max(20).required()
});