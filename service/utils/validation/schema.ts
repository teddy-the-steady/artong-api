const Joi = require('@hapi/joi');

const schema = {
    testSchema: Joi.object({
        productName: Joi.string().min(1).max(50),
        price: Joi.number().positive(),
        categoryId: Joi.number().positive()
    }),

    productSchema: Joi.object({
        productName: Joi.string().min(1).max(50),
        price: Joi.number().positive(),
        categoryId: Joi.number().positive()
    }),

    productListSchema: Joi.object({
        barcode: Joi.string().min(0).max(50).allow(''),
        name: Joi.string().min(0).max(500).allow('')
    }),

    userSchema: Joi.object({
        principalId: Joi.string().min(1).max(50).required()
    })
};

export default schema