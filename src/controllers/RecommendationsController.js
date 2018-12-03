import { errorCodes, respondError } from '../services/ErrorsService';
import { respondSuccess } from '../services/ResponsesService';
import {
  validateGetRecommendations,
  getSocialTracksRecommendations,
  generateRecommendationTracks,
} from '../services/RecommendationsService';
import User from '../models/User';
import Group from '../models/Group';
import Recommendation from '../models/Recommendation';

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
    const groupId = query.group_id;
    const spotifyAccessToken = query.spotify_access_token;
    // Getting user
    const user = await User.findOne({ _id: userId });
    // Getting group
    const group = await Group.findById(groupId);
    if (!group) {
      respondError(res, errorCodes.validationError, 'No group found with this id');
      return;
    }
    // Getting recommendations from social tracks
    const { recommendations } = await getSocialTracksRecommendations(user);
    // Getting spotify songs based on recommendations
    const recommendationTracks = await generateRecommendationTracks(
      spotifyAccessToken,
      recommendations,
    );
    // Creating recommendation on DB
    const createdRecommendation = await Recommendation.create({
      group,
      recommendation_tracks: recommendationTracks,
    });
    // Getting recommendation populated
    const recommendation = await Recommendation.findOne({ _id: createdRecommendation._id })
      .populate({ path: 'recommendation_tracks', model: 'RecommendationTrack' }).exec();

    respondSuccess(req, res, { recommendation });
  } catch (error) {
    respondError(res, errorCodes.databaseError, 'Cant get recommendations from DB');
    console.info(error);
  }
}
