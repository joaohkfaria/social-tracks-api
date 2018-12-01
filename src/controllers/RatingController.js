import { errorCodes, respondError } from '../services/ErrorsService';
import { respondSuccess } from '../services/ResponsesService';
import {
  validateCreateRating, rateTrack,
  validateGetRatings, getRatings,
} from '../services/RatingService';

export async function createRating(req, res) {
  const { body } = req;
  // Validating
  const errorValidation = validateCreateRating(body);
  if (errorValidation !== null) {
    respondError(res, errorCodes.validationError, errorValidation, req);
    return;
  }

  try {
    // Getting params from query
    const {
      user_id: userId,
      spotify_track_id: spotifyTrackId,
      value: ratingValue,
    } = body;
    // Creating rating
    const rating = await rateTrack(userId, spotifyTrackId, ratingValue);

    respondSuccess(req, res, { rating });
  } catch (error) {
    console.info(error);
    respondError(res, errorCodes.databaseError, 'Can not create rating');
  }
}

export async function getRatingsResponse(req, res) {
  const { query } = req;
  // Validating
  const errorValidation = validateGetRatings(query);
  if (errorValidation !== null) {
    respondError(res, errorCodes.validationError, errorValidation, req);
    return;
  }

  try {
    // Getting params from query
    const {
      user_id: userId,
    } = query;
    // Getting ratings
    const ratings = await getRatings(userId);

    respondSuccess(req, res, { ratings });
  } catch (error) {
    console.info(error);
    respondError(res, errorCodes.databaseError, 'Can not get ratings');
  }
}
