/**
 * Respond sucess messages using Express RES
 * @param {object} res Express RES object
 * @param {object} result The result object
 * @param {string} message optional The field to provide the user more info about the result
 */
export function respondSuccess(req, res, result, message = '') {
  res.json({
    result,
    status: 'ok',
    message,
  });
}
