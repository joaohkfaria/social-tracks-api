import mongoose from 'mongoose';
import RecommendationTrack from './RecommendationTrack';
import Group from './Group';

const { Schema } = mongoose;

const Recommendation = new Schema({
  group: {
    type: Schema.Types.ObjectId,
    ref: Group,
    required: true,
  },
  recommendation_tracks: [{
    type: Schema.Types.ObjectId,
    ref: RecommendationTrack,
  }],
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

export default mongoose.model('Recommendation', Recommendation);
