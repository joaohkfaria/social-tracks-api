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

async function updateUser(spotifyUser, spotifyTopTracks, spotifyArtists, spotifyLibrary) {
  // Getting user
  const user = await User.findOne({ email: spotifyUser.email || spotifyUser.id });
  if (!user) throw new Error('User not found to update');
  // Getting params
  const userParams = getUserParams(spotifyUser, spotifyTopTracks, spotifyArtists, spotifyLibrary);
  // Updating user
  await user.set(userParams).save();

  return user;
}

async function createUser(spotifyUser, spotifyTopTracks, spotifyArtists, spotifyLibrary) {
  // Setting params
  const userParams = getUserParams(spotifyUser, spotifyTopTracks, spotifyArtists, spotifyLibrary);
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
  const { email } = spotifyUser;
  // Checking if user exist with Email
  const userFound = await User.findOne({ email });
  // Creating or updating user
  const newUser = userFound
    ? await updateUser(spotifyUser, spotifyTopTracks, spotifyArtists, spotifyLibrary)
    : await createUser(spotifyUser, spotifyTopTracks, spotifyArtists, spotifyLibrary);

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
