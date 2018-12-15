import { errorCodes, respondError } from '../services/ErrorsService';
import { respondSuccess } from '../services/ResponsesService';
import { validateGetGroups, validateCreateGroups } from '../services/GroupService';
import Group from '../models/Group';

export async function getGroups(req, res) {
  const { query } = req;
  // Validating
  const errorValidation = validateGetGroups(query);
  if (errorValidation !== null) {
    respondError(res, errorCodes.validationError, errorValidation, req);
    return;
  }
  try {
    // Getting params from query
    const userId = query.user_id;
    // Getting groups that user is in
    const groups = await Group
      .find({ users: { $in: userId } })
      .populate({ path: 'users', model: 'User' }).exec();

    respondSuccess(req, res, { groups });
  } catch (error) {
    console.info(error);
    respondError(res, errorCodes.databaseError, 'Cant get groups for this user');
  }
}

export async function createGroup(req, res) {
  const { body } = req;
  // Validating
  const errorValidation = validateCreateGroups(body);
  if (errorValidation !== null) {
    respondError(res, errorCodes.validationError, errorValidation, req);
    return;
  }

  try {
    // Getting params
    const { name, user_id: userId, user_ids: userIds } = body;
    // Creating group
    const group = await Group.create({ name, users: [userId, ...userIds], owner: userId });

    respondSuccess(req, res, { created: true, group });
  } catch (error) {
    respondError(res, errorCodes.databaseError, 'Cant create group on DB');
    console.info(error);
  }
}

export async function deleteGroup(req, res) {
  respondSuccess(req, res, { deleted: false });
}
