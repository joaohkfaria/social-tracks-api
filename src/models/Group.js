import mongoose from 'mongoose';
import User from './User';

const { Schema } = mongoose;

const GroupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: User,
    required: false,
  }],
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

export default mongoose.model('Group', GroupSchema);
