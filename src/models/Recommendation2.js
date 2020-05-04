import mongoose from 'mongoose';
import RecommendationTrack2 from './RecommendationTrack2';
import User from './User';

const { Schema } = mongoose;

const Recommendation2 = new Schema({
  coldstart_user: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  generating_recommendation: {
    type: Schema.Types.Boolean,
    required: true,
  },
  recommendation_tracks: [{
    type: Schema.Types.ObjectId,
    ref: RecommendationTrack2,
  }],
  recommendations_without_influence_tracks: [{
    type: Schema.Types.ObjectId,
    ref: RecommendationTrack2,
  }],
  influence_factors: {
    type: Schema.Types.Mixed,
    required: false,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

export default mongoose.model('Recommendation2', Recommendation2);
