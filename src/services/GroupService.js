import Joi from 'joi';
import { createErrorMessageWithJoi } from './ErrorsService';

export function validateGetGroups(params) {
  // Creating validation schema
  const paramsSchema = Joi.object({
    user_id: Joi.string().required(),
  }).required();
  // Validating params
  const paramsValidation = paramsSchema.validate(params);
  return paramsValidation.error
    ? createErrorMessageWithJoi(paramsValidation.error)
    : null;
}

export function validateCreateGroups(params) {
  // Creating validation schema
  const paramsSchema = Joi.object({
    user_id: Joi.string().required(),
    name: Joi.string().required(),
    user_ids: Joi.array().items(Joi.string()).required(),
  }).required();
  // Validating params
  const paramsValidation = paramsSchema.validate(params);
  return paramsValidation.error
    ? createErrorMessageWithJoi(paramsValidation.error)
    : null;
}
