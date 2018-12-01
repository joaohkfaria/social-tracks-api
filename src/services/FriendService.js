import Joi from 'joi';
import { createErrorMessageWithJoi } from './ErrorsService';

export function validateGetFriends(params) {
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
