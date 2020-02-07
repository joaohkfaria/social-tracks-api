import User from '../models/User';

function getUserParams(spotifyUser, spotifyTopTracks, spotifyArtists, spotifyLibrary) {
  console.info('SPOTIFY USER', spotifyUser);
  const params = {
    spotify_id: spotifyUser.id,
    name: spotifyUser.display_name || spotifyUser.id,
    // TODO: Refactor, some users do not have a email on Spotify
    email: spotifyUser.email || spotifyUser.id,
    avatar_url: spotifyUser.images.length ? spotifyUser.images[0].url : undefined,
    spotify_top_tracks: spotifyTopTracks,
    spotify_artists: spotifyArtists,
    spotify_library: spotifyLibrary,
    spotify_user: spotifyUser,
  };

  return params;
}

async function updateUser(user, userParams) {
  // Updating user
  await user.set(userParams).save();

  return user;
}

async function createUser(userParams) {
  // Creating user
  const user = await User.create(userParams);

  return user;
}

/**
 * Creates or updates a User based on Spotify Data
 * @param {object} spotifyUser User comming from Spotify
 * @returns {object} The created/updated user
 */
export async function createOrUpdateUser(
  spotifyUser, spotifyTopTracks,
  spotifyArtists, spotifyLibrary,
) {
  // Setting params
  const userParams = getUserParams(spotifyUser, spotifyTopTracks, spotifyArtists, spotifyLibrary);
  // Checking if user exist with Email
  const userFound = await User.findOne({ email: userParams.email });
  // Creating or updating user
  const newUser = userFound
    ? await updateUser(userFound, userParams)
    : await createUser(userParams);

  return newUser;
}

export async function addOrUpdateMastodonOnUser(user, mastodonUser) {
  const updatedUser = await user.set({ mastodon_id: mastodonUser.id }).save();
  return updatedUser;
}

export async function getUsersFromGroup(group) {
  const users = await User.find({ _id: { $in: group.users } });

  return users;
}

export async function getAllUsers() {
  const users = await User.find();

  return users;
}
