const Joi = require('@hapi/joi');

module.exports.productSchema = Joi.object({
    productName: Joi.string().min(1).max(50).required(),
    price: Joi.number().positive().required(),
    categoryId: Joi.number().positive().required()
});

