/**
 * This file is very specific for Spotify API
 * It has SWAP and REFRESH token capabilities.
 * It uses a own method to make POST requests
 */
import crypto from 'crypto';
import https from 'https';
import QueryString from 'querystring';
import { SPOTIFY } from '../config';
import { respondError, errorCodes } from '../services/ErrorsService';

// Constants
const encSecret = SPOTIFY.ENCRYPTION_SECRET;
const encMethod = 'aes-256-ctr';
const authString = Buffer.from(`${SPOTIFY.CLIENT_ID}:${SPOTIFY.CLIENT_SECRET}`).toString('base64');
const authHeader = `Basic ${authString}`;

function postRequest(stringUrl, params = {}) {
  return new Promise((resolve, reject) => {
    // build request data
    const url = new URL(stringUrl);
    const reqData = {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    // create request
    const req = https.request(reqData, (res) => {
      // build response
      const buffers = [];
      res.on('data', (chunk) => {
        buffers.push(chunk);
      });

      res.on('end', () => {
        // parse response
        let result = null;
        try {
          result = Buffer.concat(buffers);
          result = result.toString();
          let contentType = res.headers['content-type'];
          if (typeof contentType === 'string') {
            contentType = contentType.split(';')[0].trim();
          }
          if (contentType === 'application/x-www-form-urlencoded') {
            result = QueryString.parse(result);
          } else if (contentType === 'application/json') {
            result = JSON.parse(result);
          }
        } catch (error) {
          error.response = res;
          error.data = result;
          reject(error);
          return;
        }
        resolve(result);
      });
    });

    // handle error
    req.on('error', (error) => {
      reject(error);
    });

    // send
    const data = QueryString.stringify(params);
    req.write(data);
    req.end();
  });
}

const encrypt = (text) => {
  const aes = crypto.createCipher(encMethod, encSecret);
  let encrypted = aes.update(text, 'utf8', 'hex');
  encrypted += aes.final('hex');
  return encrypted;
};

const decrypt = (text) => {
  const aes = crypto.createDecipher(encMethod, encSecret);
  let decrypted = aes.update(text, 'hex', 'utf8');
  decrypted += aes.final('utf8');
  return decrypted;
};

export async function swap(req, res) {
  const { code } = req.body;
  if (!code) {
    respondError(res, errorCodes.validationError, 'No code on body');
    return;
  }

  // build request data
  const params = {
    grant_type: 'authorization_code',
    redirect_uri: SPOTIFY.REDIRECT_URL,
    code,
  };

  // get new token from Spotify API
  const response = await postRequest(SPOTIFY.TOKEN_URL, params);
  console.info('REFRESH TOKEN RESPONSE', response);

  // In case there's no refresh_token
  if (!response.refresh_token) {
    respondError(res, errorCodes.externalResourceError, 'Not get refresh token from Spotify');
    return;
  }
  // Encrypting refresh_token and sending back
  const result = {
    ...response,
    refresh_token: encrypt(response.refresh_token),
  };

  res.status(200).json(result);
}

export async function refresh(req, res) {
  // Ensure refresh token parameter
  const rawRefreshToken = req.body.refresh_token;
  if (!rawRefreshToken) {
    respondError(res, errorCodes.validationError, 'No refresh_token on body');
    return;
  }

  // decrypt token
  const refreshToken = decrypt(rawRefreshToken);
  // build request data
  const params = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  };
  // get new token from Spotify API
  const response = await postRequest(SPOTIFY.TOKEN_URL, params);
  console.info('REFRESH TOKEN RESPONSE', response);

  let result = {
    ...response,
  };

  // In case there a refresh token on response
  if (response.refresh_token) {
    result = {
      ...result,
      refresh_token: encrypt(response.refresh_token),
    };
  }

  res.status(200).json(result);
}
