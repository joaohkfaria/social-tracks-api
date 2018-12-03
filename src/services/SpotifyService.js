import Joi from 'joi';
import Spotify from 'spotify-web-api-node';
import { createErrorMessageWithJoi } from './ErrorsService';

export function validateLoginSpotify(params) {
  // Creating validation schema
  const paramsSchema = Joi.object({
    access_token: Joi.string().required(),
  }).required();
  // Validating params
  const paramsValidation = paramsSchema.validate(params);
  return paramsValidation.error
    ? createErrorMessageWithJoi(paramsValidation.error)
    : null;
}

export async function getSpotifyUser(accessToken) {
  const spotifyApi = new Spotify();
  spotifyApi.setAccessToken(accessToken);

  const userData = await spotifyApi.getMe();
  if (!userData || !userData.body) throw new Error('No Spotify user found');

  return userData.body;
}

export async function getSpotifyArtists(accessToken) {
  // Initialize object
  const spotifyApi = new Spotify();
  spotifyApi.setAccessToken(accessToken);

  const artists = await spotifyApi.getFollowedArtists({ limit: 50 });

  return artists.body;
}

export async function getSpotifyTopTracks(accessToken) {
  // Initialize object
  const spotifyApi = new Spotify();
  spotifyApi.setAccessToken(accessToken);

  const topTracks = await spotifyApi.getMyTopTracks({ limit: 50 });

  return topTracks.body;
}

export async function getSpotifyLibraryTracks(accessToken) {
  // Initialize object
  const spotifyApi = new Spotify();
  spotifyApi.setAccessToken(accessToken);

  const savedTracks = await spotifyApi.getMySavedTracks({ limit: 50 });

  return savedTracks.body;
}

export async function queryTracks(accessToken, trackName, artistName) {
  // Initialize object
  const spotifyApi = new Spotify();
  spotifyApi.setAccessToken(accessToken);

  // Getting track
  const { body } = await spotifyApi.searchTracks(`${artistName}:${trackName}`, { limit: 1 });

  return body;
}
