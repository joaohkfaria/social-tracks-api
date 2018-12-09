# Social Tracks App API

This is the backend API for Social Tracks app. It can create and manage groups, get recommendations from [Social Tracks Recommender](https://github.com/joaohkfaria/social-tracks-recommender).

## How to Install

### 1. Set the ENV variables

On your ~/.bashrc or ~/.zshrc, set the following env variables:

```bash
export MASTODON_CLIENT_KEY="<YOUR_MASTODON_CLIENT_KEY>"
export MASTODON_CLIENT_SECRET="<YOUR_MASTODON_CLIENT_SECRET>"
export SPOTIFY_CLIENT_ID="<YOUR_SPOTIFY_CLIENT_ID>"
export SPOTIFY_CLIENT_SECRET="<YOUR_SPOTIFY_CLIENT_SECRET>"
export SPOTIFY_ENCRYPTION_SECRET="<YOUR_SPOTIFY_ENCRYPTION_SECRET>"
```

### 2. Requirements

You'll need [Node 11.x](https://nodejs.org) and [Yarn](https://yarnpkg.com).

On the project folder, run:

```bash
yarn install
```

### 3. Set the config file

Inside **src** folder there's a **config.js** file. There you can change the mongodb host, port and database.

```javascript
export const DB = {
  HOST: 'localhost',
  PORT: 27017,
  NAME: 'social_tracks_api',
};
```

You can also change the URL for Social Tracks Recommender location.

```javascript
const SOCIAL_TRACKS_RECOMMENDER_API = {
  production: 'http://social-tracks-recommender.now.sh',
  development: 'http://localhost:8000',
};
```

### 4. Starting the API

Inside the project root folder, run:

```bash
yarn start
```

The API will start at http://localhost:3000
