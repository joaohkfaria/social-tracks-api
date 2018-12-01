import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar_url: {
    type: String,
    required: false,
  },
  mastodon_id: {
    type: String,
    required: false,
  },
  spotify_id: {
    type: String,
    required: false,
  },
  spotify_top_tracks: {
    type: Schema.Types.Mixed,
    required: false,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

export default mongoose.model('User', UserSchema);
