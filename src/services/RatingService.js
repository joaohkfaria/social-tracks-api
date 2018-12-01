import Joi from 'joi';
import { createErrorMessageWithJoi } from './ErrorsService';
import Rating from '../models/Rating';

export function validateCreateRating(params) {
  // Creating validation schema
  const paramsSchema = Joi.object({
    user_id: Joi.string().required(),
    spotify_track_id: Joi.string().required(),
    value: Joi.number().required(),
  }).required();
  // Validating params
  const paramsValidation = paramsSchema.validate(params);
  return paramsValidation.error
    ? createErrorMessageWithJoi(paramsValidation.error)
    : null;
}

export function validateGetRatings(params) {
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

export async function rateTrack(userId, spotifyTrackId, ratingValue) {
  // Checking if rate already exist
  const rating = await Rating.findOne({ user: userId, spotify_track_id: spotifyTrackId });
  // New rating
  if (rating) return rating.set({ value: ratingValue }).save();

  return Rating.create({
    user: userId,
    value: ratingValue,
    spotify_track_id: spotifyTrackId,
  });
}

export async function getRatings(userId) {
  // Getting all ratings for user
  const ratings = await Rating.find({ user: userId });

  return ratings;
}
