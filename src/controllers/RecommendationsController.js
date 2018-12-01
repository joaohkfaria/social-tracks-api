import { errorCodes, respondError } from '../services/ErrorsService';
import { respondSuccess } from '../services/ResponsesService';
import { validateGetRecommendations } from '../services/RecommendationsService';
import User from '../models/User';

export async function getRecommendations(req, res) {
  const { query } = req;
  // Validating
  const errorValidation = validateGetRecommendations(query);
  if (errorValidation !== null) {
    respondError(res, errorCodes.validationError, errorValidation, req);
    return;
  }

  try {
    // Getting params
    const userId = query.user_id;
    // Getting user
    const user = await User.findOne({ _id: userId });
    // Getting recommendations
    const recommendations = await user.spotify_top_tracks.items;

    respondSuccess(req, res, { recommendations });
  } catch (error) {
    respondError(res, errorCodes.databaseError, 'Cant get recommendations from DB');
    console.info(error);
  }
}
