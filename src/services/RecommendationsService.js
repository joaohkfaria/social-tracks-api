import Joi from 'joi';
import { createErrorMessageWithJoi } from './ErrorsService';
import { request, POST } from './NetworkService';
import { SOCIAL_TRACKS_URL } from '../config';
import { queryTracks } from './SpotifyService';
import RecommendationTrack from '../models/RecommendationTrack';

export function validateGetRecommendations(params) {
  // Creating validation schema
  const paramsSchema = Joi.object({
    user_id: Joi.string().required(),
    group_id: Joi.string().required(),
    spotify_access_token: Joi.string().required(),
  }).required();
  // Validating params
  const paramsValidation = paramsSchema.validate(params);
  return paramsValidation.error
    ? createErrorMessageWithJoi(paramsValidation.error)
    : null;
}

export async function getSocialTracksRecommendations(users) {
  // Using User as param for get recommendations
  const params = { users };
  // Getting recommendations from social tracks
  const { result } = await request(SOCIAL_TRACKS_URL, POST, 'recommendations/generate', params);

  return result;
}

export async function generateRecommendationTracks(spotifyAccessToken, recommendations) {
  const generatedRecommendations = [];

  for (let i = 0; i < recommendations.length; i += 1) {
    const recommendation = recommendations[i];
    // Getting spotify track
    const trackName = recommendation.track_name;
    const artistName = recommendation.artist_name;
    const { tracks } = await queryTracks(spotifyAccessToken, trackName, artistName);
    // Checking if returned tracks
    if (!tracks || !tracks.items || !tracks.items.length) continue; // eslint-disable-line
    const track = tracks.items[0];
    // Creating new recommendation
    console.info(track);
    const recommendationTrack = await RecommendationTrack.create({
      ...track,
      prediction: recommendation.prediction,
    });
    // Adding to generated recommendations
    generatedRecommendations.push(recommendationTrack);
  }

  return generatedRecommendations;
}
