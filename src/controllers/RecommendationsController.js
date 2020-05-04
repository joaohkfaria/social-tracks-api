import { errorCodes, respondError } from '../services/ErrorsService';
import { respondSuccess } from '../services/ResponsesService';
import {
  validateGetRecommendations,
  getSocialTracksRecommendations,
  generateRecommendationTracks,
} from '../services/RecommendationsService';
import Recommendation2 from '../models/Recommendation2';
import { getAllUsers } from '../services/UserService';
import { getSocialResume, convertInfluenceFactors } from '../services/SocialResume';
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
    const coldstartId = query.user_id;
    const spotifyAccessToken = query.spotify_access_token;
    // Getting coldstart user
    const coldstartUser = await User.findById(coldstartId);
    // Getting recommendation populated
    let recommendation = await Recommendation2
      .findOne({ coldstart_user: coldstartUser })
      .sort({ created_at: -1 })
      .populate({ path: 'recommendation_tracks', model: 'RecommendationTrack' })
      .populate({ path: 'recommendations_without_influence_tracks', model: 'RecommendationTrack' })
      .exec();

    try {
      // Getting recommendation if there's no one saved
      if (!recommendation) {
        // Creating a pre-recommendation
        recommendation = await Recommendation2.create({
          coldstart_user: coldstartUser,
          generating_recommendation: true,
        });
        // Responding recommendation to user
        respondSuccess(req, res, { recommendation });

        // Defining the group of users
        const users = await getAllUsers();
        // Getting social resume
        const socialResume = getSocialResume(users);

        try {
          // Getting recommendations from social tracks
          const {
            recommendations,
            recommendations_without_influence,
            influence_factors: influenceFactors,
          } = await getSocialTracksRecommendations(users, socialResume, coldstartUser);
          // Getting spotify songs based on recommendations
          const recommendationTracks = await generateRecommendationTracks(
            spotifyAccessToken,
            recommendations.slice(0, 5),
          );
          const recommendationsWithoutInflunceTracks = await generateRecommendationTracks(
            spotifyAccessToken,
            recommendations_without_influence.slice(0, 5),
          );
          // Convert influence factors
          const convertedInfluenceFactors = await convertInfluenceFactors(influenceFactors);
          // Creating recommendation on DB
          await recommendation.set({
            coldstart_user: coldstartUser,
            generating_recommendation: false,
            recommendation_tracks: recommendationTracks,
            recommendations_without_influence_tracks: recommendationsWithoutInflunceTracks,
            influence_factors: convertedInfluenceFactors,
          }).save();
        } catch (error) {
          console.info(error);
          // Deleting recommendation because it was not successfully got
          await recommendation.delete();
        }
      } else {
        // Responding recommendation to user
        respondSuccess(req, res, { recommendation });
      }
    } catch (error) {
      console.info(error);
    }
  } catch (error) {
    respondError(res, errorCodes.databaseError, 'Cant get recommendations from DB');
    console.info(error);
  }
}
