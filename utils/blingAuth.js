
const fetch = require('node-fetch');

let accessToken = null;
let refreshToken = process.env.BLING_REFRESH_TOKEN;
let accessTokenExpiresAt = null;

async function getValidBlingToken() {
  const now = Date.now();

  if (accessToken && accessTokenExpiresAt && now < accessTokenExpiresAt) {
    return accessToken;
  }

  const response = await fetch('https://www.bling.com.br/Api/v3/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.BLING_CLIENT_ID,
      client_secret: process.env.BLING_CLIENT_SECRET
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Erro ao renovar o token do Bling:', data);
    throw new Error(data.error_description || 'Erro ao renovar token');
  }

  accessToken = data.access_token;
  refreshToken = data.refresh_token;
  accessTokenExpiresAt = now + (data.expires_in * 1000 * 0.9);

  return accessToken;
}

module.exports = { getValidBlingToken };
