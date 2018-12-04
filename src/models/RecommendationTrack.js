import mongoose from 'mongoose';

const { Schema } = mongoose;

const RecommendationTrack = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  uri: {
    type: String,
    required: true,
  },
  album: {
    type: Schema.Types.Mixed,
    required: true,
  },
  artists: {
    type: Schema.Types.Mixed,
    required: true,
  },
  explicit: {
    type: Boolean,
    required: true,
  },
  prediction: {
    type: Number,
    required: true,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

export default mongoose.model('RecommendationTrack', RecommendationTrack);
