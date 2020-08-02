"use strict";
const fetch = require('node-fetch');

/* This module implements the Device Authorization flow.
 * It is similar to how the python client authenticates.
 * https://auth0.com/docs/flows/concepts/device-auth
 */

// Fetches the edelweiss server's oidc configuration
const fetchOidcConfig = async (edelweissUrl) => {
  const url = `${edelweissUrl}/oidc`;
  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Url ${url} returned status ${response.status}: ${text}`);
  }
  return await response.json();
}

const fetchDeviceCode = async (oidcConfig, offline) => {
  const url = `https://${oidcConfig.domain}/oauth/device/code`;
  const payload = {
    'client_id': oidcConfig.nativeClientId,
    'scope': offline ? "offline_access" : undefined,
    'audience': oidcConfig.audience,
  };
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {'Content-Type': 'application/json'},
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Url ${url} returned status ${response.status}: ${text}`);
  }
  return await response.json();
  
}

const promptUser = (deviceCodeResponse) => {
  console.log("Visit this url in your web browser to sign into edelweiss:");
  console.log(`${deviceCodeResponse["verification_uri_complete"]}\n`);
  console.log(`Your authorization token is ${deviceCodeResponse["user_code"]}`);
  console.log("Waiting for authentication.....");
}

const pollToken = async (oidcConfig, deviceCodeResponse) => {
  const url = `https://${oidcConfig.domain}/oauth/token`;
  const payload = {
    'client_id': oidcConfig.nativeClientId,
    'device_code': deviceCodeResponse['device_code'],
    'grant_type': "urn:ietf:params:oauth:grant-type:device_code",
  };

  const expiresAt = Date.now() + deviceCodeResponse['expires_in'] * 1000;
  while (Date.now() < expiresAt) {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {'Content-Type': 'application/json'},
    });
    const content = await response.json();
    if (response.ok) {
      return content;
    } else if (content['error'] === 'authorization_pending') {
      // We expect a 4xx error code if the user has not authenticated yet.
      await new Promise((resolve) =>
        setTimeout(resolve, deviceCodeResponse['interval'] * 1000)
      )
    } else {
      const text = await response.text();
      throw new Error(`Url ${url} returned status ${response.status}: ${text}`);
    }
  }
  throw Error("Timed out waiting for authentication");

}

exports.command = ['authenticate', 'auth'];
exports.desc = 'Generate access and refresh tokens';
exports.builder = (yargs) =>
  yargs.option('refresh-token', {
    describe: 'Generate a refresh token for offline use',
  });

exports.handler = async (args) => {
  const oidcConfig = await fetchOidcConfig(args.url);
  const deviceCodeResponse = await fetchDeviceCode(oidcConfig, args['refresh-token']);

  promptUser(deviceCodeResponse);

  const tokenResponse = await pollToken(oidcConfig, deviceCodeResponse);

  console.log("Authentication successful");
  console.log(tokenResponse);

}
