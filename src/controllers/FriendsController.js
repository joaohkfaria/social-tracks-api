import { respondSuccess } from '../services/ResponsesService';
import { respondError, errorCodes } from '../services/ErrorsService';
import { validateGetFriends } from '../services/FriendService';
import User from '../models/User';

export async function getFriends(req, res) {
  const { query } = req;
  // Validating
  const errorValidation = validateGetFriends(query);
  if (errorValidation !== null) {
    respondError(res, errorCodes.validationError, errorValidation, req);
    return;
  }
  try {
    // Getting params from query
    const userId = query.user_id;
    // Getting groups that user is in
    const friends = await User.find({ _id: { $ne: userId } });

    respondSuccess(req, res, { friends });
  } catch (error) {
    console.info(error);
    respondError(res, errorCodes.databaseError, 'Cant get groups for this user');
  }
}
