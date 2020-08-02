const http = require('http');
const nStatic = require('node-static');
const fetch = require('node-fetch');
const path = require('path');


// Loads configuration from the config.default.js and config.user.js files
const globalConfig = (function() {
  const defaultConfig = require('./config.default.js');
  try {
    const userConfig = require('./config.user.js');
    return {...defaultConfig, ...userConfig}
  } catch(err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      // There is no user config - but that's OK.
      return defaultConfig;
    } else {
      throw err;
    }
  }
})();

// Fetches the edelweiss server's oidc configuration
const fetchOidcConfig = async () => {
  const url = `${globalConfig.edelweissUrl}/oidc`;
  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Url ${url} returned status ${response.status}: ${text}`);
  }
  return await response.json();
}

// Exchanges the refresh token for an access token
const fetchAccessToken = async (oidcConfig) => {
  const clientId = oidcConfig.nativeClientId;
  const audience = oidcConfig.audience;
  const oidcDomain = oidcConfig.domain;
  const url = `https://${oidcConfig.domain}/oauth/token`;
  const payload = {
    'client_id': oidcConfig.nativeClientId,
    'grant_type': "refresh_token",
    'refresh_token': globalConfig.refreshToken,
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
  const decoded = await response.json();
  return decoded['access_token'];
}

const fileServer = new nStatic.Server(path.join(__dirname, '..', 'public'));
const server = http.createServer(async (req, res) => {
  if (req.url === '/config.json') {
    try {
      const oidcConfig = await fetchOidcConfig();
      const accessToken = await fetchAccessToken(oidcConfig);

      const clientConfig = {
        edelweissUrl: globalConfig.edelweissUrl,
        accessToken: accessToken,
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(clientConfig));
    } catch (e) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      res.end(e.message);
    }
  } else {
    fileServer.serve(req, res);
  }
});

server.listen(globalConfig.port, globalConfig.hostname, () => {
  console.log(`Server running at http://${globalConfig.hostname}:${globalConfig.port}/`);
});
