/**
 * Supported Error Codes to send on a error message
 */
export const errorCodes = {
  invalidToken: {
    status: 401,
    type: 'InvalidToken',
  },
  validationError: {
    status: 400,
    type: 'ValidationError',
  },
  databaseError: {
    status: 500,
    type: 'DatabaseError',
  },
  externalResourceError: {
    status: 400,
    type: 'ExternalResourceError',
  },
  resourceNotFound: {
    status: 400,
    type: 'ResourceNotFound',
  },
  forbidToUseResource: {
    status: 402,
    type: 'ForbidToUseResource',
  },
  unknownError: {
    status: 500,
    type: 'UnknownError',
  },
};

/**
 * An custom Error Exception, with the format required by this API
 * @param {object} errorCode The error code based on the error codes provided on this file
 * @param {string} message A custom message
 * @return {ErrorException} The ErrorException constructor
 */
export function ErrorException(errorCode, message) {
  this.errorCode = errorCode;
  this.message = message;
}

/**
 * Creates a error message using the JOI Error object
 * Used for validation errors
 * @param {object} joiError The error object provided by JOI
 * @return {string} The result error message
 */
export function createErrorMessageWithJoi(joiError) {
  if (!joiError) return 'Validation error on unknown field';
  return joiError.details.map(detail => detail.message).toString();
}

/**
 * Respond error with a given Error Code and a message
 * The Error Code is one item of the list of "errorCodes" available on this file
 * @param {object} res The Express RES object
 * @param {object} errorCode The error code with type and status items inside
 * @param {string} message The custom error message, to provide the user with more info
 */
export function respondError(res, errorCode, message) {
  res.status(errorCode.status);
  res.json({
    status: 'error',
    error: {
      type: errorCode.type,
      message,
    },
  });
}
