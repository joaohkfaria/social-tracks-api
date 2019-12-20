import Joi from 'joi';
import { createErrorMessageWithJoi, ErrorException, errorCodes } from './ErrorsService';
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

export function validateUpdateMastodon(params) {
  // Creating validation schema
  const paramsSchema = Joi.object({
    user_id: Joi.string().required(), // TODO: Use a token instead of user_id
    mastodon_id: Joi.string().required(),
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
    redirect_uri: MASTODON.REDIRECT_URL,
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

export async function getFavourites(accessToken) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const response = await request(MASTODON.API_URL, GET, 'api/v1/favourites', null, headers);

  return response;
}

export async function getUserInfo(mastodonUserId) {
  const headers = {
    Authorization: `Bearer ${MASTODON.ACCESS_TOKEN}`,
  };

  const response = await request(MASTODON.API_URL, GET, `api/v1/accounts/${mastodonUserId}`, null, headers);

  return response;
}

export async function getFollowing(mastodonUserId) {
  const headers = {
    Authorization: `Bearer ${MASTODON.ACCESS_TOKEN}`,
  };

  const response = await request(MASTODON.API_URL, GET, `api/v1/accounts/${mastodonUserId}/following`, null, headers);

  return response;
}

export async function getFollowers(mastodonUserId) {
  const headers = {
    Authorization: `Bearer ${MASTODON.ACCESS_TOKEN}`,
  };

  const response = await request(MASTODON.API_URL, GET, `api/v1/accounts/${mastodonUserId}/followers`, null, headers);

  return response;
}

export async function getStatuses(mastodonUserId) {
  const headers = {
    Authorization: `Bearer ${MASTODON.ACCESS_TOKEN}`,
  };

  const response = await request(MASTODON.API_URL, GET, `api/v1/accounts/${mastodonUserId}/statuses`, null, headers);

  return response;
}

export async function getStatusFavourites(statusId) {
  const headers = {
    Authorization: `Bearer ${MASTODON.ACCESS_TOKEN}`,
  };

  const response = await request(MASTODON.API_URL, GET, `api/v1/statuses/${statusId}/favourited_by`, null, headers);

  return response;
}

export async function getStatusReblogged(statusId) {
  const headers = {
    Authorization: `Bearer ${MASTODON.ACCESS_TOKEN}`,
  };

  const response = await request(MASTODON.API_URL, GET, `api/v1/statuses/${statusId}/reblogged_by`, null, headers);

  return response;
}

export async function getStatusesWithDetails(mastodonUserId) {
  // Getting statuses
  const statuses = await getStatuses(mastodonUserId);
  const statusesWithDetails = [];

  for (let i = 0; i < statuses.length; i += 1) {
    const status = statuses[i];
    // Getting new status object
    const newStatus = {
      ...status,
      reblogged_users: await getStatusReblogged(status.id),
      favourites_users: await getStatusFavourites(status.id),
    };

    // Adding new status
    statusesWithDetails.push(newStatus);
  }

  return statusesWithDetails;
}

export async function addMastodonInfoUser(user) {
  // Getting mastodon id
  const mastodonId = user.mastodon_id;
  if (!mastodonId) throw new ErrorException(errorCodes.databaseError, 'No mastodon_id for this user');
  // Getting mastodon info
  const statuses = await getStatusesWithDetails(mastodonId);
  const following = await getFollowing(mastodonId);
  const followers = await getFollowers(mastodonId);
  // Saving to user
  const updatedUser = await user.set({
    mastodon_info: {
      statuses,
      following,
      followers,
    },
  }).save();

  return updatedUser;
}
