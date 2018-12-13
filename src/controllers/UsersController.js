import { respondSuccess } from '../services/ResponsesService';
import { respondError, errorCodes } from '../services/ErrorsService';
import {
  validateLoginSpotify,
  getSpotifyUser,
  getSpotifyTopTracks,
  getSpotifyArtists,
  getSpotifyLibraryTracks,
} from '../services/SpotifyService';
import {
  validateLoginMastodon,
  getMastodonToken,
  getMastodonUser,
  addMastodonInfoUser,
  validateUpdateMastodon,
} from '../services/MastodonService';
import { createOrUpdateUser, addOrUpdateMastodonOnUser } from '../services/UserService';
import User from '../models/User';

export async function loginSpotify(req, res) {
  // Validating params
  const { query } = req;
  const errorValidation = validateLoginSpotify(query);
  if (errorValidation !== null) {
    respondError(res, errorCodes.validationError, errorValidation, req);
    return;
  }
  // Spotify access token
  const accessToken = query.access_token;
  // Getting Spotify user info
  try {
    // Getting Spotify User with Access Token
    const spotifyUser = await getSpotifyUser(accessToken);
    // Getting spotify info
    const spotifyArtists = await getSpotifyArtists(accessToken);
    const spotifyTopTracks = await getSpotifyTopTracks(accessToken);
    const spotifySavedTracks = await getSpotifyLibraryTracks(accessToken);
    // console.info(spotifyUser);
    // console.info(spotifyArtists);
    // console.info(spotifyTopTracks);
    // console.info(spotifySavedTracks);

    // Creating or updating local user with Spotify data
    const user = await createOrUpdateUser(spotifyUser, spotifyTopTracks, spotifyArtists, spotifySavedTracks);
    console.info('CREATED/UPDATED USER:', user);

    // Responding data
    respondSuccess(req, res, { user });
  } catch (error) {
    console.info(error);
    respondError(res, errorCodes.externalResourceError, 'Can\'t get Spotify Info');
  }
}

export async function loginMastodon(req, res) {
  // Validating params
  const { query } = req;
  const errorValidation = validateLoginMastodon(query);
  if (errorValidation !== null) {
    respondError(res, errorCodes.validationError, errorValidation, req);
    return;
  }
  // Getting email and password
  const authorizationCode = query.authorization_code;
  const userId = query.user_id;
  try {
    // Getting user
    const user = await User.findById(userId);
    if (!user) throw new Error('Invalid user_id');
    // Getting access token
    const accessToken = await getMastodonToken(authorizationCode);
    const mastodonUser = await getMastodonUser(accessToken);
    // Updating user
    const updatedUser = await addOrUpdateMastodonOnUser(user, mastodonUser);
    // Adding mastodon info to user
    const updatedUserWithInfo = await addMastodonInfoUser(updatedUser);

    respondSuccess(req, res, { user: updatedUserWithInfo });
  } catch (error) {
    respondError(res, errorCodes.externalResourceError, 'Can\'t connect with Mastodon');
  }
}

export async function updateMastodon(req, res) {
  // Validating params
  const { query } = req;
  const errorValidation = validateUpdateMastodon(query);
  if (errorValidation !== null) {
    respondError(res, errorCodes.validationError, errorValidation, req);
    return;
  }

  // Getting user id
  const userId = query.user_id;

  try {
    // Getting user
    const user = await User.findById(userId);
    // Adding mastodon info to user
    const updatedUser = await addMastodonInfoUser(user);

    respondSuccess(req, res, { user: updatedUser });
  } catch (error) {
    console.info(error);
    respondError(res, errorCodes.externalResourceError, 'Can\'t get updated user with mastodon');
  }
}
