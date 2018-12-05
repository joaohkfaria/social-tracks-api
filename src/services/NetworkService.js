import fetch from 'node-fetch';

export const GET = 'GET';
export const POST = 'POST';
export const PUT = 'PUT';
export const DELETE = 'DELETE';
export const PATCH = 'PATCH';

export function getQueryString(params) {
  const esc = encodeURIComponent;
  return Object.keys(params)
    .map(k => `${esc(k)}=${esc(params[k])}`)
    .join('&');
}

export async function request(url, type = GET, path = null, params = null, headers = null) {
  // Checking the request type
  if (type !== GET && type !== POST && type !== PUT && type !== DELETE && type !== PATCH) {
    throw new Error('Wrong Type');
  }
  // Setting final endpoint
  let ENDPOINT = url;
  if (path) ENDPOINT = `${ENDPOINT}/${path}`;

  const data = {
    method: type,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Adding params
  if (params !== null && type !== GET) {
    data.body = JSON.stringify(params);
  } else if (params !== null && type === GET) {
    ENDPOINT = `${ENDPOINT}?${getQueryString(params)}`;
  }
  // Adding headers
  if (headers !== null) {
    data.headers = Object.assign(data.headers, headers);
  }

  data.timeout = 99999999;

  // Making request
  console.info(`FETCHING: ${ENDPOINT}`);
  const rawResponse = await fetch(ENDPOINT, data);
  // Creating JSON response
  try {
    const jsonResponse = await rawResponse.json();
    console.info('RESPONSE:', jsonResponse);

    return jsonResponse;
  } catch (error) {
    console.info('Unexpected Response:', rawResponse);
    throw error;
  }
}
