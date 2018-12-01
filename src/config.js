export default {
  db: {
    host: 'localhost',
    port: 27017,
    name: 'social_tracks_api',
  },
};

export const MASTODON = {
  CLIENT_KEY: process.env.MASTODON_CLIENT_KEY,
  CLIENT_SECRET: process.env.MASTODON_CLIENT_SECRET,
  API_URL: 'https://socialtracks.masto.host',
};

export const SPOTIFY = {
  TOKEN_URL: 'https://accounts.spotify.com/api/token',
  REDIRECT_URL: 'http://localhost:3000/users/login_spotify',
  CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  ENCRYPTION_SECRET: process.env.SPOTIFY_ENCRYPTION_SECRET,
};

if (!MASTODON.CLIENT_KEY || !MASTODON.CLIENT_SECRET) {
  console.info('You need to set MASTODON_CLIENT_KEY and MASTODON_CLIENT_SECRET in you ENV');
  process.exit(11);
}

if (!SPOTIFY.CLIENT_ID || !SPOTIFY.CLIENT_SECRET || !SPOTIFY.ENCRYPTION_SECRET) {
  console.info('You need to set SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET and SPOTIFY_ENCRYPTION_SECRET in you ENV');
  process.exit(12);
}
