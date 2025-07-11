import fs from 'fs/promises';
import path from 'path';

const TOKEN_PATH = path.resolve(process.cwd(), 'blingTokens.json');

export async function getValidBlingToken() {
  const tokenData = JSON.parse(await fs.readFile(TOKEN_PATH, 'utf-8'));
  const now = Date.now();

  // Verifica se o token ainda é válido por pelo menos 1 min
  if (now < tokenData.expires_at - 60000) {
    return tokenData.access_token;
  }

  // Faz o refresh
  const response = await fetch('https://www.bling.com.br/Api/v3/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: tokenData.refresh_token,
      client_id: process.env.BLING_CLIENT_ID,
      client_secret: process.env.BLING_CLIENT_SECRET,
    }),
  });

  const newData = await response.json();

  const updatedToken = {
    access_token: newData.access_token,
    refresh_token: newData.refresh_token,
    expires_at: Date.now() + newData.expires_in * 1000,
  };

  await fs.writeFile(TOKEN_PATH, JSON.stringify(updatedToken, null, 2));
  return updatedToken.access_token;
}
