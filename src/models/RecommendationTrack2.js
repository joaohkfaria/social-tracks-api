import mongoose from 'mongoose';

const { Schema } = mongoose;

const RecommendationTrack2 = new Schema({
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
  external_urls: {
    type: Schema.Types.Mixed,
    required: false,
  },
  preview_url: {
    type: String,
    required: false,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

export default mongoose.model('RecommendationTrack2', RecommendationTrack2);
