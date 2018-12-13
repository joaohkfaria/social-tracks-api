import User from '../models/User';

export function getTotalMentions(currentUser) {
  let numMentions = 0;

  if (!currentUser.mastodon_info) return numMentions;

  currentUser.mastodon_info.statuses.forEach((status) => {
    // Summing all mentions
    numMentions += status.mentions.length;
  });

  return numMentions;
}

export function getTotalComments(currentUser) {
  let numComments = 0;

  if (!currentUser.mastodon_info) return numComments;

  currentUser.mastodon_info.statuses.forEach((status) => {
    // Checking if it's a reply
    if (status.in_reply_to_account_id) numComments += 1;
  });

  return numComments;
}

export function getTotalLikes(currentUser, groupUsers) {
  let numLikes = 0;

  if (!currentUser.mastodon_info) return numLikes;

  // Passing through statuses
  groupUsers.forEach((user) => {
    if (user.email === currentUser.email) return;

    // If the user has no mastodon_info, just ignore
    if (!user.mastodon_info) return;

    user.mastodon_info.statuses.forEach((status) => {
      // Passing through all favourite users from this status
      status.favourites_users.forEach((favouriteUser) => {
        // Check if I liked the user post
        if (favouriteUser.id === currentUser.mastodon_id) {
          numLikes += 1;
        }
      });
    });
  });

  return numLikes;
}

export function getTotalShares(currentUser) {
  let numShares = 0;

  if (!currentUser.mastodon_info) return numShares;

  currentUser.mastodon_info.statuses.forEach((status) => {
    // If it's a reblog, sum the total shares
    if (status.reblog) numShares += 1;
  });

  return numShares;
}

export function getMentionedObj(currentUser, groupUsers) {
  const mentioned = {};
  // Passing through statuses
  groupUsers.forEach((user) => {
    if (user.email === currentUser.email) return;
    // Setting initial user id mentioned
    mentioned[user.email] = { quantity: 0 };

    // If the user has no mastodon_info, just ignore
    if (!currentUser.mastodon_info) return;

    currentUser.mastodon_info.statuses.forEach((status) => {
      // Passing through all mentions
      status.mentions.forEach((mentionedUser) => {
        if (mentionedUser.id === user.mastodon_id) {
          mentioned[user.email].quantity += 1;
        }
      });
    });
  });

  return mentioned;
}

export function getSharedObj(currentUser, groupUsers) {
  const shared = {};
  // Passing through statuses
  groupUsers.forEach((user) => {
    if (user.email === currentUser.email) return;
    // Setting initial user id mentioned
    shared[user.email] = { quantity: 0 };

    // If the user has no mastodon_info, just ignore
    if (!currentUser.mastodon_info) return;

    currentUser.mastodon_info.statuses.forEach((status) => {
      // Checking if it's a reblogged status
      if (!status.reblog) return;

      // Check if I reblogged from current user
      if (status.reblog.account.id === user.mastodon_id) {
        shared[user.email].quantity += 1;
      }
    });
  });

  return shared;
}

export function getLikesObj(currentUser, groupUsers) {
  const likes = {};
  // Passing through statuses
  groupUsers.forEach((user) => {
    if (user.email === currentUser.email) return;
    // Setting initial user id liked
    likes[user.email] = { quantity: 0 };

    // If the user has no mastodon_info, just ignore
    if (!user.mastodon_info) return;

    user.mastodon_info.statuses.forEach((status) => {
      // Passing through all favourite users from this status
      status.favourites_users.forEach((favouriteUser) => {
        // Check if I liked the user post
        if (favouriteUser.id === currentUser.mastodon_id) {
          likes[user.email].quantity += 1;
        }
      });
    });
  });

  return likes;
}

export function getCommentObj(currentUser, groupUsers) {
  const comment = {};
  // Passing through statuses
  groupUsers.forEach((user) => {
    if (user.email === currentUser.email) return;
    // Setting initial user id comment
    comment[user.email] = { quantity: 0 };

    // If the user has no mastodon_info, just ignore
    if (!currentUser.mastodon_info) return;

    currentUser.mastodon_info.statuses.forEach((status) => {
      // Checking if it's a reblogged status
      if (!status.in_reply_to_account_id) return;

      // Check if my comment is a reply to user
      if (status.in_reply_to_account_id === user.mastodon_id) {
        comment[user.email].quantity += 1;
      }
    });
  });

  return comment;
}

export function getMusicResume(user) {
  let numFollowers = 0;
  let numSongs = 0;
  let numArtists = 0;

  if (user.spotify_artists) {
    numArtists = user.spotify_artists.artists.total;
  }
  if (user.spotify_library) {
    numSongs = user.spotify_library.total;
  }
  if (user.spotify_user) {
    numFollowers = user.spotify_user.followers.total;
  }


  return {
    num_followers: numFollowers,
    num_songs: numSongs,
    num_artists: numArtists,
  };
}

export function getSocialResume(users) {
  let socialResume = [];

  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    const mentioned = getMentionedObj(user, users);
    const shared = getSharedObj(user, users);
    const likes = getLikesObj(user, users);
    const comment = getCommentObj(user, users);
    const totalMentions = getTotalMentions(user);
    const totalComments = getTotalComments(user);
    const totalLikes = getTotalLikes(user, users);
    const totalShares = getTotalShares(user);

    socialResume = [
      ...socialResume,
      {
        id: user.email,
        social: {
          total_mentions: totalMentions,
          total_comments: totalComments,
          total_likes: totalLikes,
          total_shares: totalShares,
          mentioned,
          shared,
          likes,
          comment,
        },
        music: getMusicResume(user),
      },
    ];
  }

  return socialResume;
}

export async function convertInfluenceFactors(influenceFactors) {
  const factors = Object.keys(influenceFactors);
  const converted = {};

  // Passing through factors
  for (let i = 0; i < factors.length; i += 1) {
    const factor = factors[i];
    converted[factor] = {};
    // Getting emails
    const emails = Object.keys(influenceFactors[factor]);
    // Passing through emails
    for (let j = 0; j < emails.length; j += 1) {
      const email = emails[j];
      const user = await User.findOne({ email });
      if (!user) continue;

      converted[factor] = {
        ...converted[factor],
        [user._id]: influenceFactors[factor][email],
      };
    }
  }

  return converted;
}
