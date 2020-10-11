export {};
const Joi = require('@hapi/joi');

module.exports.testSchema = Joi.object({
    productName: Joi.string().min(1).max(50),
    price: Joi.number().positive(),
    categoryId: Joi.number().positive()
});

module.exports.productSchema = Joi.object({
    productName: Joi.string().min(1).max(50),
    price: Joi.number().positive(),
    categoryId: Joi.number().positive()
});

module.exports.productListSchema = Joi.object({
    barcode: Joi.string().min(0).max(50).allow(''),
    name: Joi.string().min(0).max(500).allow('')
});

module.exports.userSchema = Joi.object({
    principalId: Joi.string().min(1).max(50).required()
});