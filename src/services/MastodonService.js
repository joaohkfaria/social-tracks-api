import Joi from 'joi';
import { createErrorMessageWithJoi } from './ErrorsService';
import { request, POST, GET } from './NetworkService';
import { MASTODON } from '../config';

export function validateLoginMastodon(params) {
  // Creating validation schema
  const paramsSchema = Joi.object({
    user_id: Joi.string().required(), // TODO: Use a token instead of user_id
    authorization_code: Joi.string().required(),
  }).required();
  // Validating params
  const paramsValidation = paramsSchema.validate(params);
  return paramsValidation.error
    ? createErrorMessageWithJoi(paramsValidation.error)
    : null;
}

export async function getMastodonToken(authorizationCode) {
  const params = {
    client_id: MASTODON.CLIENT_KEY,
    client_secret: MASTODON.CLIENT_SECRET,
    grant_type: 'authorization_code',
    code: authorizationCode,
    redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
  };

  const response = await request(MASTODON.API_URL, POST, 'oauth/token', params);
  const accessToken = response.access_token;

  return accessToken;
}

export async function getMastodonUser(accessToken) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const response = await request(MASTODON.API_URL, GET, 'api/v1/accounts/verify_credentials', null, headers);

  return response;
}
