import mongoose from 'mongoose';
import User from './User';

const { Schema } = mongoose;

const RatingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  spotify_track_id: {
    type: String,
    required: true,
  },
  value: {
    type: Schema.Types.Number,
    required: true,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

export default mongoose.model('Rating', RatingSchema);
