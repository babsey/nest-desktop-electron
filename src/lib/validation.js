"use strict"


// Form input validation
const joi = require('joi');

var validation = {};

validation.schemas = {
    'number': joi.number().required(),
    'interger': joi.number().integer().required(),
    'array': joi.array().items(joi.number().integer())
}

validation.validate = (value, schema) => joi.validate(value, validation.schemas[schema]);

module.exports = validation
